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

export default async function TagDetailPage({ params }: PageProps) {
  const { slug } = await params

  const tag = await prisma.tag
    .findUnique({
      where: { slug },
      select: { id: true, name: true, slug: true },
    })
    .catch(() => null)

  if (!tag) notFound()

  const posts = await prisma.post
    .findMany({
      where: {
        status: 'published',
        tags: {
          some: {
            tagId: tag.id,
          },
        },
      },
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
        <BackButton label="返回上一级" fallbackHref="/posts" className="-ml-2" />
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          返回首页
        </Link>
      </div>

      <div className="space-y-2">
        <h1 className="text-4xl font-bold">#{tag.name}</h1>
        <p className="text-muted-foreground">标签相关文章</p>
      </div>

      {posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
          该标签下暂无文章。
        </div>
      )}
    </div>
  )
}

