/**
 * 认证工具函数
 *
 * @说明
 * 提供在 Server Components 和 Server Actions 中获取会话的工具函数
 *
 * @技术原理
 * 1. getServerSession: NextAuth 提供的服务器端会话函数
 * 2. 只能在 Server Components 和 Server Actions 中使用
 * 3. 不能在 Client Components 中使用 (使用 useSession hook)
 *
 * @使用场景
 * - Server Components: 获取当前用户信息
 * - Server Actions: 验证用户权限
 * - API Routes: 保护 API 端点
 * - Middleware: 路由保护
 */

import { getServerSession } from 'next-auth'
import { authOptions } from './auth'

/**
 * 获取当前会话
 *
 * @说明
 * 在服务器端获取当前用户会话
 *
 * @返回值
 * - Session 对象: 用户已登录
 * - null: 用户未登录
 *
 * @使用示例
 * ```typescript
 * // 在 Server Component 中
 * import { getCurrentSession } from '@/lib/session'
 *
 * export default async function Page() {
 *   const session = await getCurrentSession()
 *
 *   if (!session) {
 *     redirect('/login')
 *   }
 *
 *   return <div>欢迎, {session.user.name}</div>
 * }
 * ```
 *
 * @技术细节
 * - 这是一个异步函数
 * - 只在服务器端运行
 * - 会自动从请求中提取会话信息
 */
export async function getCurrentSession() {
  return await getServerSession(authOptions)
}

/**
 * 获取当前用户
 *
 * @说明
 * 快捷方式,直接获取用户对象
 *
 * @返回值
 * - User 对象: 用户已登录
 * - undefined: 用户未登录
 *
 * @使用示例
 * ```typescript
 * import { getCurrentUser } from '@/lib/session'
 *
 * export default async function Page() {
 *   const user = await getCurrentUser()
 *
 *   if (!user) {
 *     return <div>请先登录</div>
 *   }
 *
 *   return <div>欢迎, {user.name}</div>
 * }
 * ```
 */
export async function getCurrentUser() {
  const session = await getCurrentSession()
  return session?.user
}

/**
 * 检查用户是否已认证
 *
 * @说明
 * 检查用户是否已登录
 *
 * @返回值
 * - true: 已登录
 * - false: 未登录
 *
 * @使用示例
 * ```typescript
 * import { isAuthenticated } from '@/lib/session'
 *
 * export default async function Page() {
 *   const authenticated = await isAuthenticated()
 *
 *   if (!authenticated) {
 *     redirect('/login')
 *   }
 *
 *   return <div>受保护的内容</div>
 * }
 * ```
 */
export async function isAuthenticated() {
  const session = await getCurrentSession()
  return !!session
}

/**
 * 检查用户是否为管理员
 *
 * @说明
 * 检查用户角色是否为 ADMIN
 *
 * @返回值
 * - true: 是管理员
 * - false: 不是管理员
 *
 * @使用示例
 * ```typescript
 * import { isAdmin } from '@/lib/session'
 *
 * export default async function AdminPage() {
 *   const admin = await isAdmin()
 *
 *   if (!admin) {
 *     return <div>无权访问</div>
 *   }
 *
 *   return <div>管理员面板</div>
 * }
 * ```
 */
export async function isAdmin() {
  const user = await getCurrentUser()
  return user?.role === 'ADMIN'
}

/**
 * 要求用户已认证
 *
 * @说明
 * 如果用户未登录,抛出错误
 * 适合用在 Server Actions 中
 *
 * @throws Error 用户未认证
 *
 * @使用示例
 * ```typescript
 * 'use server'
 *
 * import { requireAuth } from '@/lib/session'
 *
 * export async function createPost(data: FormData) {
 *   // 确保用户已登录
 *   const user = await requireAuth()
 *
 *   // 继续处理...
 *   await prisma.post.create({ ... })
 * }
 * ```
 */
export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error('未认证')
  }

  return user
}

/**
 * 要求管理员权限
 *
 * @说明
 * 如果用户不是管理员,抛出错误
 * 适合用在需要管理员权限的 Server Actions 中
 *
 * @throws Error 无权限
 *
 * @使用示例
 * ```typescript
 * 'use server'
 *
 * import { requireAdmin } from '@/lib/session'
 *
 * export async function deleteUser(userId: string) {
 *   // 确保用户是管理员
 *   await requireAdmin()
 *
 *   // 继续处理...
 *   await prisma.user.delete({ where: { id: userId } })
 * }
 * ```
 */
export async function requireAdmin() {
  const user = await requireAuth()

  if (user.role !== 'ADMIN') {
    throw new Error('需要管理员权限')
  }

  return user
}
