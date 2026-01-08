import { BackButton } from '@/components/navigation/back-button'

export default function DashboardMediaPage() {
  return (
    <div className="space-y-6">
      <BackButton label="返回仪表盘" fallbackHref="/dashboard" className="-ml-2" />

      <div>
        <h1 className="text-3xl font-bold">媒体库</h1>
        <p className="text-muted-foreground">业务需求未明确，先使用静态页面占位。</p>
      </div>

      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        这里后续可实现：图片上传、管理、封面图选择、压缩与 CDN 域名配置等。
      </div>
    </div>
  )
}

