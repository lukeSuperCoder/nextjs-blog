/**
 * 搜索页面（CSR）
 */

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PostCard, type PostCardPost } from '@/components/post-card'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<PostCardPost[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      if (!response.ok) throw new Error('搜索失败')
      const data: { results?: PostCardPost[] } = await response.json()
      setResults(data.results ?? [])
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialQuery) handleSearch(initialQuery)
  }, [initialQuery])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query !== initialQuery) void handleSearch(query)
    }, 500)
    return () => clearTimeout(timer)
  }, [query, initialQuery])

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <Button asChild variant="ghost" className="-ml-2">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              返回首页
            </Link>
          </Button>
        </div>

        <div>
          <h1 className="mb-4 text-4xl font-bold">搜索文章</h1>
          <p className="text-muted-foreground">输入关键词搜索相关文章</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="搜索..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 text-lg"
            autoFocus
          />
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
            <p className="mt-4 text-muted-foreground">搜索中...</p>
          </div>
        ) : results.length > 0 ? (
          <div>
            <p className="mb-6 text-sm text-muted-foreground">找到 {results.length} 篇相关文章</p>
            <div className="space-y-6">
              {results.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        ) : query ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">未找到相关文章</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
