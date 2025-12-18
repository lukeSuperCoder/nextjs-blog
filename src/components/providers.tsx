/**
 * Session Provider 组件
 *
 * @说明
 * 提供会话上下文给客户端组件
 *
 * @技术原理
 * 1. SessionProvider 来自 next-auth/react
 * 2. 在客户端提供会话数据
 * 3. 允许使用 useSession hook
 * 4. 必须在 Client Component 中使用
 *
 * @为什么需要这个文件?
 * - SessionProvider 是一个 Client Component
 * - 根布局是 Server Component
 * - 不能直接在根布局中使用 Client Component
 * - 所以创建这个包装组件
 *
 * @使用方式
 * 在根布局中导入并使用:
 * ```tsx
 * import { Providers } from '@/components/providers'
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <Providers>{children}</Providers>
 *       </body>
 *     </html>
 *   )
 * }
 * ```
 */

'use client'

import { SessionProvider } from 'next-auth/react'

/**
 * Providers 组件
 *
 * @说明
 * 包装所有全局 Provider
 * 目前只有 SessionProvider,未来可以添加更多
 *
 * @参数
 * - children: 子组件
 *
 * @技术细节
 * - 'use client': 标记为客户端组件
 * - SessionProvider: 提供会话上下文
 * - 不需要传递 session prop (会自动获取)
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
