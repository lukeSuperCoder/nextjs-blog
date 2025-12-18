/**
 * 首页组件
 *
 * @说明
 * 这是应用的首页 (对应路由: /)
 * 展示当前登录状态和基本信息
 *
 * @技术原理 - Next.js App Router
 * 1. page.tsx 定义路由页面
 * 2. 文件系统路由: src/app/page.tsx -> /
 * 3. 这是一个 Server Component,可以直接访问数据库
 */

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getCurrentUser } from '@/lib/session'
import { LogoutButton } from '@/components/logout-button'

export default async function Home() {
  // 获取当前用户 (服务器端)
  const user = await getCurrentUser()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-bold mb-4">Next.js Blog</h1>

        {user ? (
          // 已登录状态
          <div className="space-y-4">
            <p className="text-lg text-muted-foreground">
              欢迎回来, <span className="font-semibold text-foreground">{user.name}</span>!
            </p>
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm text-muted-foreground">
                邮箱: {user.email}
              </p>
              <p className="text-sm text-muted-foreground">
                角色: {user.role === 'ADMIN' ? '管理员' : '普通用户'}
              </p>
            </div>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link href="/dashboard">进入后台</Link>
              </Button>
              <LogoutButton />
            </div>
          </div>
        ) : (
          // 未登录状态
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground mb-8">
              项目初始化完成!开始构建你的博客系统
            </p>

            <div className="flex gap-4 justify-center mb-8">
              <Button asChild size="lg">
                <Link href="/login">登录</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/register">注册</Link>
              </Button>
            </div>

            <div className="flex gap-4 justify-center">
              <div className="p-6 border rounded-lg">
                <h2 className="text-xl font-semibold mb-2">✅ 项目初始化</h2>
                <p className="text-sm text-muted-foreground">Next.js + TypeScript</p>
              </div>

              <div className="p-6 border rounded-lg">
                <h2 className="text-xl font-semibold mb-2">✅ 样式配置</h2>
                <p className="text-sm text-muted-foreground">Tailwind CSS</p>
              </div>

              <div className="p-6 border rounded-lg">
                <h2 className="text-xl font-semibold mb-2">✅ 数据库</h2>
                <p className="text-sm text-muted-foreground">Prisma + PostgreSQL</p>
              </div>
            </div>

            <div className="mt-8 p-6 border rounded-lg">
              <h2 className="text-xl font-semibold mb-2">✅ 认证系统</h2>
              <p className="text-sm text-muted-foreground">NextAuth.js 配置完成</p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
