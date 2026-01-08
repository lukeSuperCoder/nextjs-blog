import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { MarkdownRenderer } from '@/components/post/markdown-renderer'
import { Badge } from '@/components/ui/badge'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export const revalidate = 3600

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: {
      status: 'published',
    },
    select: {
      slug: true,
    },
  })

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.post.findUnique({
    where: { slug },
    select: {
      title: true,
      excerpt: true,
      coverImage: true,
      metaTitle: true,
      metaDescription: true,
      metaKeywords: true,
    },
  })

  if (!post) {
    return {
      title: '文章不存在',
    }
  }

  const keywords = post.metaKeywords
    ?.split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || undefined,
    keywords,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      images: post.coverImage ? [post.coverImage] : undefined,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || undefined,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  }
}

async function getPost(slug: string) {
  return prisma.post.findUnique({
    where: { slug },
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
  })
}

async function incrementViews(slug: string) {
  await prisma.post.update({
    where: { slug },
    data: {
      views: {
        increment: 1,
      },
    },
  })
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post || post.status !== 'published') {
    notFound()
  }

  await incrementViews(slug)

  return (
    <article className="container py-12">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          {post.category && (
            <Link href={`/posts?category=${post.category.slug}`}>
              <Badge className="mb-4">{post.category.name}</Badge>
            </Link>
          )}

          <h1 className="mb-4 text-4xl font-bold">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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

          {post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map(({ tag }) => (
                <Link key={tag.id} href={`/posts?tag=${tag.slug}`}>
                  <Badge variant="outline">#{tag.name}</Badge>
                </Link>
              ))}
            </div>
          )}
        </header>

        {post.coverImage && (
          <div className="mb-8 overflow-hidden rounded-lg">
            <img src={post.coverImage} alt={post.title} className="w-full" />
          </div>
        )}

        <div className="prose prose-lg max-w-none dark:prose-invert">
          <MarkdownRenderer content={post.content} />
        </div>

        <footer className="mt-12 border-t pt-8">
          <div className="flex items-center gap-4">
            {post.author?.image && (
              <img
                src={post.author.image}
                alt={post.author.name ?? ''}
                className="h-12 w-12 rounded-full object-cover"
              />
            )}
            <div>
              <p className="font-medium">{post.author?.name}</p>
              <p className="text-sm text-muted-foreground">作者</p>
            </div>
          </div>
        </footer>
      </div>
    </article>
  )
}
