/**
 * 数据库连接测试脚本
 *
 * @说明
 * 测试 Prisma Client 是否能正确连接到数据库
 * 并显示数据库中的数据
 */

import { prisma } from '../src/lib/prisma'

async function main() {
  console.log('🔍 测试数据库连接...\n')

  try {
    // 测试连接
    await prisma.$connect()
    console.log('✅ 数据库连接成功!\n')

    // 查询用户
    console.log('👤 用户列表:')
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })
    console.table(users)

    // 查询分类
    console.log('\n📁 分类列表:')
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { posts: true },
        },
      },
    })
    console.table(
      categories.map((c) => ({
        名称: c.name,
        Slug: c.slug,
        文章数: c._count.posts,
      }))
    )

    // 查询标签
    console.log('\n🏷️  标签列表:')
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: { posts: true },
        },
      },
    })
    console.table(
      tags.map((t) => ({
        名称: t.name,
        Slug: t.slug,
        使用次数: t._count.posts,
      }))
    )

    // 查询文章
    console.log('\n📝 文章列表:')
    const posts = await prisma.post.findMany({
      include: {
        author: { select: { name: true } },
        category: { select: { name: true } },
        tags: {
          include: {
            tag: { select: { name: true } },
          },
        },
      },
    })

    posts.forEach((post) => {
      console.log(`\n📄 ${post.title}`)
      console.log(`   作者: ${post.author.name}`)
      console.log(`   分类: ${post.category.name}`)
      console.log(`   标签: ${post.tags.map((pt) => pt.tag.name).join(', ')}`)
      console.log(`   浏览: ${post.views} 次`)
      console.log(`   状态: ${post.published ? '✅ 已发布' : '📝 草稿'}`)
    })

    console.log('\n\n✅ 数据库测试完成!')
  } catch (error) {
    console.error('❌ 数据库连接失败:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
