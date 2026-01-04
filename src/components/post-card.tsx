/**
 * 文章卡片组件
 *
 * @说明
 * 显示单篇文章的卡片,包含标题、摘要、分类、标签、日期等
 *
 * @技术原理
 * 1. 接收文章数据作为 props
 * 2. 使用 Next.js Link 实现导航
 * 3. 响应式设计,移动端和桌面端自适应
 *
 * @功能
 * - 文章标题和摘要
 * - 分类和标签
 * - 发布日期
 * - 浏览次数
 * - 悬停效果
 */

import Link from 'next/link'
import { Calendar, Eye } from 'lucide-react'
import { formatDistance } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface PostCardProps {
  post: {
    id: string
    title: string
    slug: string
    excerpt: string | null
    coverImage: string | null
    views: number
    publishedAt: Date | null
    category: {
      name: string
      slug: string
    }
    tags: Array<{
      tag: {
        name: string
        slug: string
      }
    }>
  }
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg">
      {/* 封面图 (如果有) */}
      {post.coverImage && (
        <Link href={`/posts/${post.slug}`}>
          <div className="aspect-video overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
        </Link>
      )}

      <div className="p-6">
        {/* 分类 */}
        <Link
          href={`/category/${post.category.slug}`}
          className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
        >
          {post.category.name}
        </Link>

        {/* 标题 */}
        <Link href={`/posts/${post.slug}`}>
          <h2 className="mt-4 text-2xl font-bold tracking-tight transition-colors group-hover:text-primary">
            {post.title}
          </h2>
        </Link>

        {/* 摘要 */}
        {post.excerpt && (
          <p className="mt-3 line-clamp-3 text-muted-foreground">{post.excerpt}</p>
        )}

        {/* 标签 */}
        {post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map(({ tag }) => (
              <Link
                key={tag.slug}
                href={`/tag/${tag.slug}`}
                className="text-xs text-muted-foreground transition-colors hover:text-primary"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}

        {/* 元信息 */}
        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          {/* 发布时间 */}
          {post.publishedAt && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.publishedAt.toISOString()}>
                {formatDistance(post.publishedAt, new Date(), {
                  addSuffix: true,
                  locale: zhCN,
                })}
              </time>
            </div>
          )}

          {/* 浏览次数 */}
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{post.views} 次浏览</span>
          </div>
        </div>
      </div>
    </article>
  )
}
