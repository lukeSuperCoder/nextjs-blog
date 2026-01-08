'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'

function parseCommaList(input: FormDataEntryValue | null) {
  if (typeof input !== 'string') return []
  return input
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function slugifyLoose(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
}

export async function deletePost(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id') || '')
  if (!id) return

  await prisma.post.delete({ where: { id } })
  revalidatePath('/dashboard/posts')
}

export async function createPost(formData: FormData) {
  const user = await requireAdmin()

  const title = String(formData.get('title') || '').trim()
  const slug = String(formData.get('slug') || '').trim()
  const excerpt = String(formData.get('excerpt') || '').trim() || null
  const coverImage = String(formData.get('coverImage') || '').trim() || null
  const status = String(formData.get('status') || 'draft')
  const categoryId = String(formData.get('categoryId') || '').trim()
  const content = String(formData.get('content') || '')

  if (!title || !slug || !categoryId || !content) {
    throw new Error('缺少必填字段')
  }

  const tagNames = parseCommaList(formData.get('tags'))
  const tagRecords = await Promise.all(
    tagNames.map(async (name) => {
      const generatedSlug = slugifyLoose(name)
      const tagSlug = generatedSlug || name
      return prisma.tag.upsert({
        where: { name },
        update: {},
        create: { name, slug: tagSlug },
      })
    })
  )

  const publishedAt = status === 'published' ? new Date() : null

  await prisma.post.create({
    data: {
      title,
      slug,
      excerpt,
      coverImage,
      status,
      content,
      publishedAt,
      authorId: user.id,
      categoryId,
      tags: {
        create: tagRecords.map((tag) => ({
          tagId: tag.id,
        })),
      },
    },
  })

  revalidatePath('/dashboard/posts')
  redirect('/dashboard/posts')
}

export async function updatePost(formData: FormData) {
  await requireAdmin()

  const id = String(formData.get('id') || '').trim()
  const title = String(formData.get('title') || '').trim()
  const slug = String(formData.get('slug') || '').trim()
  const excerpt = String(formData.get('excerpt') || '').trim() || null
  const coverImage = String(formData.get('coverImage') || '').trim() || null
  const status = String(formData.get('status') || 'draft')
  const categoryId = String(formData.get('categoryId') || '').trim()
  const content = String(formData.get('content') || '')

  if (!id || !title || !slug || !categoryId || !content) {
    throw new Error('缺少必填字段')
  }

  const existing = await prisma.post.findUnique({
    where: { id },
    select: { publishedAt: true, status: true },
  })

  if (!existing) {
    throw new Error('文章不存在')
  }

  const tagNames = parseCommaList(formData.get('tags'))
  const tagRecords = await Promise.all(
    tagNames.map(async (name) => {
      const generatedSlug = slugifyLoose(name)
      const tagSlug = generatedSlug || name
      return prisma.tag.upsert({
        where: { name },
        update: {},
        create: { name, slug: tagSlug },
      })
    })
  )

  const nextPublishedAt =
    status === 'published'
      ? existing.publishedAt ?? new Date()
      : null

  await prisma.post.update({
    where: { id },
    data: {
      title,
      slug,
      excerpt,
      coverImage,
      status,
      content,
      publishedAt: nextPublishedAt,
      categoryId,
      tags: {
        deleteMany: {},
        create: tagRecords.map((tag) => ({ tagId: tag.id })),
      },
    },
  })

  revalidatePath('/dashboard/posts')
  revalidatePath(`/dashboard/posts/${id}/edit`)
  redirect('/dashboard/posts')
}
