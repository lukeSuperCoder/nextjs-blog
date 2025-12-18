/**
 * NextAuth API Route Handler
 *
 * @说明
 * Next.js 14 App Router 的 NextAuth 动态路由处理器
 *
 * @技术原理 - Next.js 14 Route Handlers
 * 1. route.ts 是 App Router 的 API 路由文件
 * 2. [...nextauth] 是动态捕获所有路由
 * 3. 捕获的路由: /api/auth/*
 *
 * @路由示例
 * - /api/auth/signin     -> 登录
 * - /api/auth/signout    -> 登出
 * - /api/auth/session    -> 获取会话
 * - /api/auth/csrf       -> CSRF token
 * - /api/auth/providers  -> 提供商列表
 *
 * @导出要求
 * - 必须导出命名导出 (不能是 default export)
 * - GET: 处理 GET 请求
 * - POST: 处理 POST 请求
 *
 * @使用方式
 * NextAuth 会自动处理所有认证相关的请求
 * 我们只需要导出 handler 即可
 */

import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * NextAuth Handler
 *
 * @说明
 * 创建 NextAuth 请求处理器
 * 使用我们在 @/lib/auth 中定义的配置
 *
 * @技术细节
 * - NextAuth() 返回一个包含 GET 和 POST 方法的对象
 * - 这些方法会处理所有认证相关的 HTTP 请求
 * - 自动处理 CSRF 保护、会话管理等
 */
const handler = NextAuth(authOptions)

// 导出 GET 和 POST 方法
// Next.js 14 要求使用命名导出
export { handler as GET, handler as POST }
