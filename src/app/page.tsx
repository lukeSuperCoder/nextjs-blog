/**
 * 首页
 *
 * @说明
 * 博客首页,展示最新文章列表
 *
 * @技术原理 - Next.js App Router
 * 1. 这是一个 Server Component
 * 2. 直接在服务器端查询数据库
 * 3. 自动实现 SSR (服务器端渲染)
 * 4. 支持 ISR (增量静态再生成)
 *
 * @功能
 * - 显示最新发布的文章
 * - 分页功能
 * - 响应式布局
 */

import { Navbar } from '@/components/navbar'
import { PostCard } from '@/components/post-card'
import { prisma } from '@/lib/prisma'

/**
 * 获取文章列表
 *
 * @说明
 * 从数据库查询已发布的文章
 *
 * @技术细节
 * 1. 使用 Prisma Client 查询
 * 2. 包含关联数据 (分类、标签、作者)
 * 3. 按发布时间倒序排列
 * 4. 只返回已发布的文章
 *
 * @参数
 * - page: 页码 (默认 1)
 * - pageSize: 每页数量 (默认 10)
 */
async function getPosts(page = 1, pageSize = 10) {
  const skip = (page - 1) * pageSize

  const [posts, total] = await Promise.all([
    // 查询文章列表
    prisma.post.findMany({
      where: {
        published: true, // 只查询已发布的文章
      },
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
        author: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        publishedAt: 'desc', // 按发布时间倒序
      },
      skip,
      take: pageSize,
    }),

    // 查询总数 (用于分页)
    prisma.post.count({
      where: {
        published: true,
      },
    }),
  ])

  return { posts, total, totalPages: Math.ceil(total / pageSize) }
}

export default async function Home() {
  // 获取文章数据
  const { posts } = await getPosts()

  return (
    <div className="min-h-screen bg-background">
      {/* 导航栏 */}
      <Navbar />

      {/* 主内容区 */}
      <main className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">最新文章</h1>
          <p className="mt-2 text-muted-foreground">
            分享技术知识和学习心得
          </p>
        </div>

        {/* 文章列表 */}
        {posts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          // 空状态
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed">
            <p className="text-lg text-muted-foreground">还没有文章</p>
            <p className="mt-2 text-sm text-muted-foreground">
              快去后台发布第一篇文章吧！
            </p>
          </div>
        )}
      </main>

      {/* 页脚 */}
      <footer className="mt-auto border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 Next.js Blog. 使用 Next.js 14 构建.</p>
        </div>
      </footer>
    </div>
  )
}
