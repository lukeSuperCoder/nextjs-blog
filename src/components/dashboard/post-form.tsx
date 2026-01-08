'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { slugify } from '@/lib/slug'
import dynamic from 'next/dynamic'

const MarkdownEditor = dynamic(
  () =>
    import('@/components/dashboard/markdown-editor').then((mod) => mod.MarkdownEditor),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
        编辑器加载中...
      </div>
    ),
  }
)

type CategoryOption = {
  id: string
  name: string
}

export type PostFormValues = {
  id?: string
  title: string
  slug: string
  excerpt?: string | null
  coverImage?: string | null
  status: 'draft' | 'published'
  categoryId: string
  tags?: string
  content: string
}

interface PostFormProps {
  categories: CategoryOption[]
  defaultValues: PostFormValues
  submitLabel: string
  action: (formData: FormData) => Promise<void>
}

export function PostForm({ categories, defaultValues, submitLabel, action }: PostFormProps) {
  const hasCategories = categories.length > 0
  const [title, setTitle] = useState(defaultValues.title)
  const [slug, setSlug] = useState(defaultValues.slug)
  const [slugDirty, setSlugDirty] = useState(Boolean(defaultValues.id))

  return (
    <form action={action} className="space-y-6">
      {defaultValues.id && <input type="hidden" name="id" value={defaultValues.id} />}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">标题</Label>
          <Input
            id="title"
            name="title"
            value={title}
            onChange={(e) => {
              const nextTitle = e.target.value
              setTitle(nextTitle)
              if (!slugDirty) setSlug(slugify(nextTitle))
            }}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            value={slug}
            onChange={(e) => {
              setSlugDirty(true)
              setSlug(e.target.value)
            }}
            required
            readOnly={Boolean(defaultValues.id)}
            className={defaultValues.id ? 'bg-muted cursor-not-allowed' : ''}
          />
          <p className="text-xs text-muted-foreground">
            用于 URL，例如：`/posts/your-slug`
            {defaultValues.id && ' （编辑时不可修改）'}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="categoryId">分类</Label>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={defaultValues.categoryId || (hasCategories ? categories[0].id : '')}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            required
            disabled={!hasCategories}
          >
            {!hasCategories && (
              <option value="" disabled>
                请选择分类
              </option>
            )}
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {!hasCategories && (
            <p className="text-xs text-destructive">请先创建分类（文章必须绑定分类）</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">状态</Label>
          <select
            id="status"
            name="status"
            defaultValue={defaultValues.status}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            <option value="draft">草稿</option>
            <option value="published">已发布</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">摘要</Label>
        <textarea
          id="excerpt"
          name="excerpt"
          defaultValue={defaultValues.excerpt ?? ''}
          className="min-h-[90px] w-full rounded-md border bg-background px-3 py-2 text-sm outline-none"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="coverImage">封面图</Label>
        <Input
          id="coverImage"
          name="coverImage"
          defaultValue={defaultValues.coverImage ?? ''}
          placeholder="https://..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">标签（逗号分隔）</Label>
        <Input id="tags" name="tags" defaultValue={defaultValues.tags ?? ''} placeholder="react,nextjs,prisma" />
      </div>

      <div className="space-y-2">
        <Label>正文（Markdown）</Label>
        <MarkdownEditor name="content" defaultValue={defaultValues.content} />
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  )
}
