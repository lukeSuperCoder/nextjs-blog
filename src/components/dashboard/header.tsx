/**
 * 后台顶部工具栏
 */

'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface DashboardHeaderProps {
  user: {
    name?: string | null
    email: string
    image?: string | null
    role: string
  }
}

function getUserInitials(user: DashboardHeaderProps['user']) {
  const base = (user.name || user.email || '').trim()
  return base ? base.slice(0, 1).toUpperCase() : '?'
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const initials = getUserInitials(user)

  return (
    <header className="h-16 border-b bg-card px-6 flex items-center justify-between">
      <div className="font-medium">后台管理</div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-9 px-2">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || user.email}
                className="h-7 w-7 rounded-full object-cover"
              />
            ) : (
              <span className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-sm">
                {initials}
              </span>
            )}
            <span className="ml-2 text-sm">{user.name || user.email}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href="/">返回前台</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault()
              void signOut({ callbackUrl: '/login' })
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            退出登录
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}

