/**
 * NextAuth.js 认证配置
 *
 * @说明
 * 这是 NextAuth.js 的核心配置文件,定义了认证策略、回调函数等
 *
 * @技术原理 - NextAuth.js
 * 1. NextAuth.js 是 Next.js 的官方认证解决方案
 * 2. 支持多种认证方式:
 *    - OAuth (Google, GitHub, etc.)
 *    - 邮箱登录
 *    - 凭证登录 (用户名/密码)
 * 3. 自动处理会话管理、CSRF 保护等
 *
 * @策略选择
 * - JWT 策略: 会话存储在加密的 JWT token 中 (我们使用这个)
 * - Database 策略: 会话存储在数据库中
 *
 * @为什么使用 JWT?
 * - 无状态: 不需要查询数据库验证会话
 * - 可扩展: 适合分布式系统
 * - 性能好: 减少数据库查询
 *
 * @最佳实践
 * - 使用强密钥 (NEXTAUTH_SECRET)
 * - 限制 JWT 过期时间
 * - 在 JWT 中只存储必要信息
 * - 敏感操作重新验证密码
 */

import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

/**
 * NextAuth 配置选项
 *
 * @配置说明
 * - adapter: 数据库适配器 (Prisma)
 * - providers: 认证提供商列表
 * - session: 会话配置
 * - pages: 自定义页面路径
 * - callbacks: 回调函数 (扩展默认行为)
 */
export const authOptions: NextAuthOptions = {
  // NextAuth 密钥 (必须设置)
  secret: process.env.NEXTAUTH_SECRET,

  // 注意: 使用 JWT 策略时不能使用 adapter
  // adapter 用于 database 策略
  // adapter: PrismaAdapter(prisma) as Adapter,

  // 认证提供商
  providers: [
    /**
     * 凭证提供商 (用户名/密码登录)
     *
     * @流程
     * 1. 用户提交邮箱和密码
     * 2. authorize 函数验证凭证
     * 3. 返回用户对象或 null
     * 4. NextAuth 创建会话
     *
     * @安全性
     * - 密码使用 bcrypt 加密存储
     * - 登录失败不透露用户是否存在
     * - 可以添加登录尝试次数限制
     */
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: '邮箱', type: 'email' },
        password: { label: '密码', type: 'password' },
      },

      /**
       * 验证用户凭证
       *
       * @param credentials - 用户提交的凭证
       * @returns 用户对象 | null
       *
       * @技术细节
       * 1. 根据邮箱查询用户
       * 2. 验证密码是否匹配
       * 3. 返回用户信息 (不包含密码)
       */
      async authorize(credentials) {
        // 检查凭证是否存在
        if (!credentials?.email || !credentials?.password) {
          throw new Error('邮箱和密码不能为空')
        }

        // 查询用户
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        // 用户不存在
        if (!user) {
          throw new Error('邮箱或密码错误')
        }

        // 用户没有密码 (可能是 OAuth 登录的用户)
        if (!user.password) {
          throw new Error('请使用第三方登录')
        }

        // 验证密码
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          throw new Error('邮箱或密码错误')
        }

        // 返回用户对象 (不包含密码)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        }
      },
    }),

    // 可以在这里添加其他提供商
    // GoogleProvider({ ... })
    // GitHubProvider({ ... })
  ],

  /**
   * 会话策略配置
   *
   * @strategy
   * - jwt: 使用 JWT token (我们使用这个)
   * - database: 使用数据库会话
   *
   * @maxAge
   * - 会话最大有效期 (秒)
   * - 30 天 = 30 * 24 * 60 * 60
   */
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 天
  },

  /**
   * JWT 配置
   *
   * @maxAge
   * - JWT 最大有效期 (秒)
   * - 应该和 session maxAge 一致
   */
  // 不需要单独配置 jwt,使用顶层 secret 即可

  /**
   * 自定义页面路径
   *
   * @说明
   * 覆盖 NextAuth 的默认页面
   * 使用我们自己设计的登录/注册页面
   */
  pages: {
    signIn: '/login', // 登录页面
    // signOut: '/auth/signout',    // 登出页面
    // error: '/auth/error',        // 错误页面
    // verifyRequest: '/auth/verify', // 邮箱验证页面
    // newUser: '/auth/new-user'    // 新用户页面
  },

  /**
   * 回调函数
   *
   * @说明
   * 扩展 NextAuth 的默认行为
   * 可以在这里添加自定义逻辑
   */
  callbacks: {
    /**
     * JWT 回调
     *
     * @说明
     * 当创建或更新 JWT token 时调用
     * 可以在这里向 token 添加额外信息
     *
     * @触发时机
     * - 用户登录时
     * - 访问 /api/auth/session 时
     * - 调用 getSession() 或 useSession() 时
     *
     * @参数
     * - token: JWT token 对象
     * - user: 用户对象 (只在登录时存在)
     * - account: 账户对象 (只在登录时存在)
     *
     * @注意
     * - 不要在 token 中存储敏感信息
     * - JWT 有大小限制 (约 4KB)
     */
    async jwt({ token, user }) {
      // 登录时,将用户信息添加到 token
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },

    /**
     * Session 回调
     *
     * @说明
     * 当创建会话对象时调用
     * 可以在这里自定义返回给客户端的会话数据
     *
     * @触发时机
     * - 调用 getSession() 时
     * - 调用 useSession() 时
     * - 访问 /api/auth/session 时
     *
     * @参数
     * - session: 会话对象 (返回给客户端)
     * - token: JWT token 对象
     *
     * @注意
     * - session 对象会暴露给客户端
     * - 不要返回敏感信息
     */
    async session({ session, token }) {
      // 将 token 中的信息添加到 session
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },

  /**
   * 事件回调
   *
   * @说明
   * 异步事件,不会阻塞响应
   * 可以用于日志记录、分析等
   */
  events: {
    // 用户登录时
    async signIn({ user }) {
      console.log(`用户登录: ${user.email}`)
    },
    // 用户登出时
    async signOut({ token }) {
      console.log(`用户登出: ${token.email}`)
    },
  },

  /**
   * 调试模式
   *
   * @说明
   * 开发环境启用详细日志
   * 生产环境禁用
   */
  debug: process.env.NODE_ENV === 'development',
}
