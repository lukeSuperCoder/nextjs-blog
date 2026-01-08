import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { BackButton } from '@/components/navigation/back-button'
import { PostCard } from '@/components/post-card'

export const revalidate = 60

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function CategoryDetailPage({ params }: PageProps) {
  const { slug } = await params

  const category = await prisma.category
    .findUnique({
      where: { slug },
      select: { id: true, name: true, slug: true, description: true },
    })
    .catch(() => null)

  if (!category) notFound()

  const posts = await prisma.post
    .findMany({
      where: { status: 'published', categoryId: category.id },
      orderBy: { publishedAt: 'desc' },
      include: {
        category: { select: { name: true, slug: true } },
        tags: { include: { tag: { select: { name: true, slug: true } } } },
      },
      take: 20,
    })
    .catch(() => [])

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <BackButton label="返回上一级" fallbackHref="/categories" className="-ml-2" />
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          返回首页
        </Link>
      </div>

      <div className="space-y-2">
        <h1 className="text-4xl font-bold">{category.name}</h1>
        {category.description && <p className="text-muted-foreground">{category.description}</p>}
      </div>

      {posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
          该分类下暂无文章。
        </div>
      )}
    </div>
  )
}

