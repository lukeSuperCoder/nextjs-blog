/**
 * 仪表盘页面
 *
 * @渲染策略: SSR
 *
 * @说明:
 * - 需要实时数据
 * - 需要权限验证 (由 layout 处理)
 */

import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, FileText, Heart, Tag } from 'lucide-react'

async function getStats() {
  const [
    totalPosts,
    publishedPosts,
    draftPosts,
    totalViews,
    totalLikes,
    totalCategories,
    totalTags,
  ] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: 'published' } }),
    prisma.post.count({ where: { status: 'draft' } }),
    prisma.post.aggregate({ _sum: { views: true } }),
    prisma.post.aggregate({ _sum: { likes: true } }),
    prisma.category.count(),
    prisma.tag.count(),
  ])

  return {
    totalPosts,
    publishedPosts,
    draftPosts,
    totalViews: totalViews._sum.views || 0,
    totalLikes: totalLikes._sum.likes || 0,
    totalCategories,
    totalTags,
  }
}

async function getRecentPosts() {
  return prisma.post.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { category: true },
  })
}

export default async function DashboardPage() {
  const [stats, recentPosts] = await Promise.all([getStats(), getRecentPosts()])

  const statCards = [
    {
      title: '总文章数',
      value: stats.totalPosts,
      icon: FileText,
      description: `${stats.publishedPosts} 已发布, ${stats.draftPosts} 草稿`,
    },
    {
      title: '总浏览量',
      value: stats.totalViews,
      icon: Eye,
      description: '所有文章的浏览量',
    },
    {
      title: '总点赞数',
      value: stats.totalLikes,
      icon: Heart,
      description: '所有文章的点赞数',
    },
    {
      title: '分类/标签',
      value: `${stats.totalCategories}/${stats.totalTags}`,
      icon: Tag,
      description: '分类和标签总数',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">仪表盘</h1>
        <p className="text-muted-foreground">欢迎回来,查看你的博客统计</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>最近文章</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0"
              >
                <div className="space-y-1">
                  <p className="font-medium">{post.title}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {post.category && (
                      <span className="px-2 py-0.5 bg-secondary rounded">
                        {post.category.name}
                      </span>
                    )}
                    <span>{post.status === 'published' ? '已发布' : '草稿'}</span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">{post.views} 浏览</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

