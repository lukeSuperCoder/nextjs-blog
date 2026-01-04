/**
 * 用户菜单组件
 *
 * @说明
 * 已登录用户的下拉菜单,显示用户信息和操作选项
 *
 * @技术原理
 * 1. 这是一个 Client Component (需要交互)
 * 2. 使用 Radix UI Dropdown Menu
 * 3. 接收用户信息作为 props
 *
 * @功能
 * - 显示用户头像和名称
 * - 下拉菜单: 个人中心、后台管理、退出登录
 * - 管理员显示"后台管理"入口
 */

'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { User, Settings, LogOut, LayoutDashboard } from 'lucide-react'

interface UserMenuProps {
  user: {
    name?: string | null
    email?: string
    role?: string
  }
}

export function UserMenu({ user }: UserMenuProps) {
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">{user.name || '用户'}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user.name || '用户'}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>个人中心</span>
          </Link>
        </DropdownMenuItem>

        {/* 管理员才显示后台管理 */}
        {user.role === 'ADMIN' && (
          <DropdownMenuItem asChild>
            <Link href="/dashboard" className="cursor-pointer">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>后台管理</span>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>退出登录</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
