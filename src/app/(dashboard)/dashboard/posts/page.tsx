import Link from 'next/link'
import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { deletePost } from '@/app/(dashboard)/dashboard/posts/actions'
import { BackButton } from '@/components/navigation/back-button'
import { Edit, Plus, Trash2 } from 'lucide-react'

interface PageProps {
  searchParams: Promise<{
    status?: string
    search?: string
  }>
}

async function getPosts(status?: string, search?: string) {
  const where: Prisma.PostWhereInput = {}

  if (status && status !== 'all') {
    where.status = status
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
    ]
  }

  return prisma.post.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { name: true } },
      category: true,
    },
  })
}

function buildQueryString(search?: string, status?: string) {
  const params = new URLSearchParams()
  if (status) params.set('status', status)
  if (search) params.set('search', search)
  const query = params.toString()
  return query ? `?${query}` : ''
}

export default async function PostsListPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  const status = resolvedSearchParams.status
  const search = resolvedSearchParams.search?.trim()

  const posts = await getPosts(status, search)

  return (
    <div className="space-y-6">
      <BackButton label="返回仪表盘" fallbackHref="/dashboard" className="-ml-2" />

      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">文章管理</h1>
          <p className="text-muted-foreground">管理所有文章</p>
        </div>
        <Link href="/dashboard/posts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            新建文章
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          <Link href={`/dashboard/posts${buildQueryString(search)}`}>
            <Button variant={!status || status === 'all' ? 'default' : 'outline'}>全部</Button>
          </Link>
          <Link href={`/dashboard/posts${buildQueryString(search, 'published')}`}>
            <Button variant={status === 'published' ? 'default' : 'outline'}>已发布</Button>
          </Link>
          <Link href={`/dashboard/posts${buildQueryString(search, 'draft')}`}>
            <Button variant={status === 'draft' ? 'default' : 'outline'}>草稿</Button>
          </Link>
        </div>

        <form action="/dashboard/posts" method="get" className="flex items-center gap-2">
          {status && <input type="hidden" name="status" value={status} />}
          <input
            name="search"
            defaultValue={search ?? ''}
            className="h-10 w-full md:w-72 rounded-md border bg-background px-3 text-sm"
            placeholder="搜索标题/正文"
          />
          <Button type="submit" variant="outline">
            搜索
          </Button>
        </form>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-4">标题</th>
              <th className="text-left p-4">分类</th>
              <th className="text-left p-4">状态</th>
              <th className="text-left p-4">浏览量</th>
              <th className="text-left p-4">创建时间</th>
              <th className="text-right p-4">操作</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b last:border-b-0">
                <td className="p-4">
                  <div className="space-y-1">
                    <p className="font-medium">{post.title}</p>
                    {post.excerpt && (
                      <p className="text-xs text-muted-foreground line-clamp-1">{post.excerpt}</p>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <Badge variant="secondary">{post.category.name}</Badge>
                </td>
                <td className="p-4">
                  <Badge variant={post.status === 'published' ? 'default' : 'outline'}>
                    {post.status === 'published' ? '已发布' : '草稿'}
                  </Badge>
                </td>
                <td className="p-4">{post.views}</td>
                <td className="p-4 text-muted-foreground">{formatDate(post.createdAt)}</td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/dashboard/posts/${post.id}/edit`}>
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <form action={deletePost}>
                      <input type="hidden" name="id" value={post.id} />
                      <Button size="sm" variant="ghost" className="text-destructive" type="submit">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={6} className="p-10 text-center text-muted-foreground">
                  暂无文章
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
