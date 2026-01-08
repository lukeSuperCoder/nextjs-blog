/**
 * 后台布局组件
 *
 * @说明
 * - 路由组: (dashboard) 不影响 URL
 * - 独立布局: 与前台不同的布局
 * - 权限控制: 只有管理员可访问
 */

import { redirect } from 'next/navigation'
import { getCurrentSession } from '@/lib/session'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/header'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const session = await getCurrentSession()

  if (!session) {
    redirect(`/login?callbackUrl=${encodeURIComponent('/dashboard')}`)
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/')
  }

  return (
    <div className="min-h-screen flex">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader user={session.user} />
        <main className="flex-1 p-6 bg-muted/10">{children}</main>
      </div>
    </div>
  )
}

