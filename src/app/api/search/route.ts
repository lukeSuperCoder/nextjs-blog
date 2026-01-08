import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim()

  if (!query) {
    return NextResponse.json({ error: '请提供搜索关键词' }, { status: 400 })
  }

  try {
    const results = await prisma.post.findMany({
      where: {
        status: 'published',
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
          { excerpt: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 20,
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        views: true,
        publishedAt: true,
        category: { select: { name: true, slug: true } },
        tags: {
          select: {
            tag: {
              select: { name: true, slug: true },
            },
          },
        },
      },
    })

    return NextResponse.json({ results, count: results.length })
  } catch {
    return NextResponse.json({ error: '搜索失败,请稍后重试' }, { status: 500 })
  }
}
