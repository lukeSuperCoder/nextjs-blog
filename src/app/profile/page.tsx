import Link from 'next/link'
import { redirect } from 'next/navigation'
import { BackButton } from '@/components/navigation/back-button'
import { getCurrentUser } from '@/lib/session'
import { Button } from '@/components/ui/button'

export default async function ProfilePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(`/login?callbackUrl=${encodeURIComponent('/profile')}`)
  }

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl space-y-6">
        <BackButton label="返回首页" fallbackHref="/" className="-ml-2" />

        <div className="space-y-2">
          <h1 className="text-4xl font-bold">个人中心</h1>
          <p className="text-muted-foreground">业务内容暂未明确，先静态展示基础信息。</p>
        </div>

        <div className="rounded-lg border bg-card p-6 space-y-3">
          <div className="text-sm">
            <span className="text-muted-foreground">邮箱：</span>
            <span className="font-medium">{user.email}</span>
          </div>
          {user.name && (
            <div className="text-sm">
              <span className="text-muted-foreground">昵称：</span>
              <span className="font-medium">{user.name}</span>
            </div>
          )}
          <div className="text-sm">
            <span className="text-muted-foreground">角色：</span>
            <span className="font-medium">{user.role}</span>
          </div>

          {user.role === 'ADMIN' && (
            <Button asChild variant="outline">
              <Link href="/dashboard">进入后台</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

