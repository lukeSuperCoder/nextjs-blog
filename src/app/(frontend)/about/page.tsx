import { BackButton } from '@/components/navigation/back-button'

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <BackButton label="返回首页" fallbackHref="/" className="-ml-2" />

      <div className="space-y-2">
        <h1 className="text-4xl font-bold">关于</h1>
        <p className="text-muted-foreground">业务内容暂未确定，先使用静态页面占位。</p>
      </div>

      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        这里可以放站点介绍、作者信息、联系方式、技术栈说明等内容。
      </div>
    </div>
  )
}

