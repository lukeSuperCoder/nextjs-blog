import { Fragment } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BackButton } from '@/components/navigation/back-button'

interface PageProps {
  searchParams: Promise<{
    page?: string
    category?: string
    tag?: string
  }>
}

const PAGE_SIZE = 10

export const revalidate = 60

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams
  const page = Number(resolvedSearchParams.page) || 1
  const baseTitle = '文章列表'
  const context =
    resolvedSearchParams.category ?? resolvedSearchParams.tag ?? `第 ${page} 页`

  return {
    title: `${baseTitle} - ${context}`,
    description: '浏览博客的全部文章',
  }
}

async function getPosts(
  page: number = 1,
  pageSize: number = PAGE_SIZE,
  category?: string,
  tag?: string
) {
  const where: Prisma.PostWhereInput = {
    status: 'published',
  }

  if (category) {
    where.category = {
      slug: category,
    }
  }

  if (tag) {
    where.tags = {
      some: {
        tag: {
          slug: tag,
        },
      },
    }
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        publishedAt: 'desc',
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
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
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    }),
    prisma.post.count({ where }),
  ])

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return {
    posts,
    pagination: {
      total,
      page,
      pageSize,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  }
}

function buildQueryString({
  page,
  category,
  tag,
}: {
  page?: number
  category?: string
  tag?: string
}) {
  const params = new URLSearchParams()
  if (page && page > 1) params.set('page', String(page))
  if (category) params.set('category', category)
  if (tag) params.set('tag', tag)

  const query = params.toString()
  return query ? `?${query}` : ''
}

export default async function PostsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  const page = Math.max(1, Number(resolvedSearchParams.page) || 1)
  const category = resolvedSearchParams.category?.trim()
  const tag = resolvedSearchParams.tag?.trim()

  const { posts, pagination } = await getPosts(page, PAGE_SIZE, category, tag)

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <BackButton label="返回首页" fallbackHref="/" className="-ml-2" />
        </div>

        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold">
            {category
              ? `分类: ${category}`
              : tag
                ? `标签: ${tag}`
                : '所有文章'}
          </h1>
          <p className="text-muted-foreground">共 {pagination.total} 篇文章</p>
        </div>

        {posts.length > 0 ? (
          <div className="space-y-8">
            {posts.map((post) => (
              <article key={post.id} className="border-b pb-8 last:border-b-0">
                {post.category && (
                  <Link href={`/posts?category=${post.category.slug}`}>
                    <Badge variant="secondary" className="mb-3">
                      {post.category.name}
                    </Badge>
                  </Link>
                )}

                <Link href={`/posts/${post.slug}`}>
                  <h2 className="text-2xl font-bold transition-colors hover:text-primary">
                    {post.title}
                  </h2>
                </Link>

                {post.excerpt && (
                  <p className="mt-2 line-clamp-3 text-muted-foreground">
                    {post.excerpt}
                  </p>
                )}

                {post.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map(({ tag: tagItem }) => (
                      <Link
                        key={tagItem.id}
                        href={`/posts?tag=${tagItem.slug}`}
                      >
                        <Badge variant="outline" className="hover:bg-secondary">
                          {tagItem.name}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                  {post.publishedAt && (
                    <time dateTime={post.publishedAt.toISOString()}>
                      {formatDate(post.publishedAt)}
                    </time>
                  )}
                  <span>·</span>
                  <span>{post.views} 次阅读</span>
                  <span>·</span>
                  <span>{post.likes} 个赞</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-muted-foreground">暂无文章</div>
        )}

        {pagination.totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            {pagination.hasPrevPage && (
              <Link
                href={`/posts${buildQueryString({
                  page: page - 1,
                  category,
                  tag,
                })}`}
              >
                <Button variant="outline">上一页</Button>
              </Link>
            )}

            <div className="flex items-center gap-2">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter((pageNum) => {
                  return (
                    pageNum === 1 ||
                    pageNum === pagination.totalPages ||
                    Math.abs(pageNum - page) <= 2
                  )
                })
                .map((pageNum, index, array) => {
                  const prev = array[index - 1]
                  const showEllipsis = prev && pageNum - prev > 1

                  return (
                    <Fragment key={pageNum}>
                      {showEllipsis && (
                        <span className="px-2 text-sm text-muted-foreground">
                          ...
                        </span>
                      )}
                      <Link
                        href={`/posts${buildQueryString({
                          page: pageNum,
                          category,
                          tag,
                        })}`}
                      >
                        <Button
                          variant={pageNum === page ? 'default' : 'outline'}
                        >
                          {pageNum}
                        </Button>
                      </Link>
                    </Fragment>
                  )
                })}
            </div>

            {pagination.hasNextPage && (
              <Link
                href={`/posts${buildQueryString({
                  page: page + 1,
                  category,
                  tag,
                })}`}
              >
                <Button variant="outline">下一页</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
