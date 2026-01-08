/**
 * 后台侧边栏组件
 */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  FileText,
  FolderTree,
  Image,
  LayoutDashboard,
  Settings,
  Tags,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  { title: '仪表盘', href: '/dashboard', icon: LayoutDashboard },
  { title: '文章管理', href: '/dashboard/posts', icon: FileText },
  { title: '分类管理', href: '/dashboard/categories', icon: FolderTree },
  { title: '标签管理', href: '/dashboard/tags', icon: Tags },
  { title: '媒体库', href: '/dashboard/media', icon: Image },
  { title: '设置', href: '/dashboard/settings', icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-card">
      <div className="p-6">
        <h2 className="text-2xl font-bold">后台管理</h2>
      </div>

      <nav className="px-3 pb-6">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

