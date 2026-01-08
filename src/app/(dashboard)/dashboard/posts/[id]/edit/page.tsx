import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { PostForm } from '@/components/dashboard/post-form'
import { updatePost } from '@/app/(dashboard)/dashboard/posts/actions'
import { BackButton } from '@/components/navigation/back-button'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params

  const [categories, post] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    }),
    prisma.post.findUnique({
      where: { id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    }),
  ])

  if (!post) notFound()

  return (
    <div className="space-y-6">
      <BackButton label="返回文章管理" fallbackHref="/dashboard/posts" className="-ml-2" />
      <div>
        <h1 className="text-3xl font-bold">编辑文章</h1>
        <p className="text-muted-foreground">{post.title}</p>
      </div>

      <PostForm
        categories={categories}
        defaultValues={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          coverImage: post.coverImage,
          status: (post.status as 'draft' | 'published') || 'draft',
          categoryId: post.categoryId,
          tags: post.tags.map((t) => t.tag.name).join(','),
          content: post.content,
        }}
        submitLabel="保存"
        action={updatePost}
      />
    </div>
  )
}
