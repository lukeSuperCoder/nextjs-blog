import { BackButton } from '@/components/navigation/back-button'

export default function DashboardSettingsPage() {
  return (
    <div className="space-y-6">
      <BackButton label="返回仪表盘" fallbackHref="/dashboard" className="-ml-2" />

      <div>
        <h1 className="text-3xl font-bold">设置</h1>
        <p className="text-muted-foreground">业务需求未明确，先使用静态页面占位。</p>
      </div>

      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        这里后续可实现：站点信息、SEO 默认配置、登录策略、上传域名白名单等。
      </div>
    </div>
  )
}

