import { prisma } from '@/lib/prisma'
import { PostForm } from '@/components/dashboard/post-form'
import { createPost } from '@/app/(dashboard)/dashboard/posts/actions'
import { BackButton } from '@/components/navigation/back-button'

export default async function NewPostPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  })

  if (categories.length === 0) {
    return (
      <div className="space-y-2">
        <BackButton label="返回文章管理" fallbackHref="/dashboard/posts" className="-ml-2" />
        <h1 className="text-3xl font-bold">新建文章</h1>
        <p className="text-muted-foreground">请先创建分类（文章必须绑定分类）</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <BackButton label="返回文章管理" fallbackHref="/dashboard/posts" className="-ml-2" />
      <div>
        <h1 className="text-3xl font-bold">新建文章</h1>
        <p className="text-muted-foreground">创建一篇新的博客文章</p>
      </div>

      <PostForm
        categories={categories}
        defaultValues={{
          title: '',
          slug: '',
          excerpt: '',
          coverImage: '',
          status: 'draft',
          categoryId: categories[0].id,
          tags: '',
          content: '',
        }}
        submitLabel="创建"
        action={createPost}
      />
    </div>
  )
}
