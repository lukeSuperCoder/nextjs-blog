import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { BackButton } from '@/components/navigation/back-button'
import { Badge } from '@/components/ui/badge'

export const revalidate = 60

export default async function CategoriesPage() {
  const categories = await prisma.category
    .findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, slug: true, description: true },
    })
    .catch(() => [])

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <BackButton label="返回首页" fallbackHref="/" className="-ml-2" />

      <div className="space-y-2">
        <h1 className="text-4xl font-bold">分类</h1>
        <p className="text-muted-foreground">浏览不同分类下的文章。</p>
      </div>

      {categories.length > 0 ? (
        <div className="grid gap-3">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className="rounded-lg border bg-card p-4 hover:bg-muted/40 transition-colors"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-medium">{c.name}</div>
                  {c.description && (
                    <div className="mt-1 text-sm text-muted-foreground">{c.description}</div>
                  )}
                </div>
                <Badge variant="secondary">查看</Badge>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
          暂无分类（或数据库未连接）。你可以先在后台创建分类后再查看。
        </div>
      )}
    </div>
  )
}

