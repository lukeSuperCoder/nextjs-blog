/**
 * NextAuth 类型扩展
 *
 * @说明
 * 扩展 NextAuth 的默认类型定义
 * 添加我们自定义的字段 (如: role)
 *
 * @技术原理 - TypeScript 模块扩展
 * 使用 declare module 语法扩展已有类型
 * 这样 TypeScript 就知道我们添加的字段
 *
 * @最佳实践
 * - 在项目根目录创建 types 文件夹
 * - 所有类型扩展放在这里
 * - 使用 /// <reference types="..." /> 引用
 */

import 'next-auth'
import 'next-auth/jwt'

// 扩展 next-auth 模块
declare module 'next-auth' {
  /**
   * Session 接口扩展
   *
   * @说明
   * 扩展会话对象,添加 role 字段
   * 这样在使用 useSession() 时就有类型提示
   */
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      role: string // 添加 role 字段
    }
  }

  /**
   * User 接口扩展
   *
   * @说明
   * 扩展用户对象,添加 role 字段
   * authorize 函数返回的用户对象
   */
  interface User {
    id: string
    email: string
    name?: string | null
    image?: string | null
    role: string // 添加 role 字段
  }
}

// 扩展 next-auth/jwt 模块
declare module 'next-auth/jwt' {
  /**
   * JWT 接口扩展
   *
   * @说明
   * 扩展 JWT token,添加自定义字段
   * 这些字段会存储在加密的 token 中
   */
  interface JWT {
    id: string
    role: string
  }
}
