import { BackButton } from '@/components/navigation/back-button'

export default function DashboardTagsPage() {
  return (
    <div className="space-y-6">
      <BackButton label="返回仪表盘" fallbackHref="/dashboard" className="-ml-2" />

      <div>
        <h1 className="text-3xl font-bold">标签管理</h1>
        <p className="text-muted-foreground">业务需求未明确，先使用静态页面占位。</p>
      </div>

      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        这里后续可实现：标签列表、新建/编辑/删除、合并标签、热门标签统计等。
      </div>
    </div>
  )
}

