/**
 * 导航栏组件
 *
 * @说明
 * 网站顶部导航栏,包含 Logo、导航链接、用户菜单等
 *
 * @技术原理
 * 1. 这是一个 Server Component (默认)
 * 2. 在服务器端获取用户会话
 * 3. 根据登录状态显示不同的菜单
 * 4. 使用 Next.js Link 实现客户端路由
 *
 * @功能
 * - Logo 和网站标题
 * - 导航链接 (首页、分类、关于等)
 * - 用户菜单 (登录/注册 或 用户信息/退出)
 * - 响应式设计
 */

import Link from 'next/link'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getCurrentUser } from '@/lib/session'
import { UserMenu } from './user-menu'
import { ThemeToggle } from '@/components/theme-toggle'

export async function Navbar() {
  // 在服务器端获取当前用户
  const user = await getCurrentUser()

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo 和标题 */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">📝</span>
            <span className="text-xl font-bold">Next.js Blog</span>
          </Link>

          {/* 导航链接 */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              首页
            </Link>
            <Link
              href="/posts"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              文章
            </Link>
            <Link
              href="/categories"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              分类
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              关于
            </Link>
          </div>

          {/* 用户菜单 */}
          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/search" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">搜索</span>
              </Link>
            </Button>

            <ThemeToggle />
            {user ? (
              // 已登录: 显示用户菜单
              <UserMenu user={user} />
            ) : (
              // 未登录: 显示登录/注册按钮
              <div className="flex items-center space-x-2">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login">登录</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/register">注册</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
