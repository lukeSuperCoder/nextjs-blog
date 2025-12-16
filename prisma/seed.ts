/**
 * 数据库种子脚本
 *
 * @说明
 * 用于初始化数据库的测试数据
 *
 * @技术原理
 * 1. 使用 Prisma Client 插入初始数据
 * 2. 包含: 管理员账号、分类、标签、示例文章
 * 3. 幂等性: 多次执行不会重复创建
 *
 * @运行方式
 * ```bash
 * npm run db:seed
 * ```
 *
 * @注意事项
 * - 密码使用 bcrypt 加密
 * - 邮箱和 slug 必须唯一
 * - 先创建分类和标签,再创建文章
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 开始播种数据...')

  // 1. 创建管理员用户
  console.log('👤 创建管理员用户...')
  const adminPassword = await bcrypt.hash('admin123456', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: '管理员',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  console.log('✅ 管理员用户创建成功:', admin.email)

  // 2. 创建分类
  console.log('📁 创建文章分类...')

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'technology' },
      update: {},
      create: {
        name: '技术',
        slug: 'technology',
        description: '技术相关文章',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'life' },
      update: {},
      create: {
        name: '生活',
        slug: 'life',
        description: '生活随笔',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'tutorial' },
      update: {},
      create: {
        name: '教程',
        slug: 'tutorial',
        description: '学习教程',
      },
    }),
  ])

  console.log('✅ 创建了', categories.length, '个分类')

  // 3. 创建标签
  console.log('🏷️  创建文章标签...')

  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'nextjs' },
      update: {},
      create: { name: 'Next.js', slug: 'nextjs' },
    }),
    prisma.tag.upsert({
      where: { slug: 'react' },
      update: {},
      create: { name: 'React', slug: 'react' },
    }),
    prisma.tag.upsert({
      where: { slug: 'typescript' },
      update: {},
      create: { name: 'TypeScript', slug: 'typescript' },
    }),
    prisma.tag.upsert({
      where: { slug: 'tailwindcss' },
      update: {},
      create: { name: 'Tailwind CSS', slug: 'tailwindcss' },
    }),
    prisma.tag.upsert({
      where: { slug: 'prisma' },
      update: {},
      create: { name: 'Prisma', slug: 'prisma' },
    }),
  ])

  console.log('✅ 创建了', tags.length, '个标签')

  // 4. 创建示例文章
  console.log('📝 创建示例文章...')

  const post1 = await prisma.post.upsert({
    where: { slug: 'welcome-to-nextjs-blog' },
    update: {},
    create: {
      title: '欢迎来到 Next.js 博客系统',
      slug: 'welcome-to-nextjs-blog',
      excerpt: '这是一个使用 Next.js 14、TypeScript 和 Prisma 构建的现代博客系统',
      content: `# 欢迎来到 Next.js 博客系统

## 简介

这是一个使用最新技术栈构建的现代博客系统:

- **Next.js 14**: 使用 App Router 和 Server Components
- **TypeScript**: 类型安全的开发体验
- **Prisma**: 现代化的 ORM
- **Tailwind CSS**: 原子化 CSS 框架
- **shadcn/ui**: 可定制的 UI 组件

## 特性

- ✅ 文章管理 (创建、编辑、删除)
- ✅ 分类和标签系统
- ✅ Markdown 渲染
- ✅ 代码高亮
- ✅ 响应式设计
- ✅ 暗色模式
- ✅ SEO 优化

## 开始使用

1. 创建账号并登录
2. 进入后台管理
3. 开始创建你的第一篇文章!

祝你使用愉快! 🎉`,
      published: true,
      publishedAt: new Date(),
      authorId: admin.id,
      categoryId: categories[0].id, // 技术分类
      tags: {
        create: [
          { tag: { connect: { id: tags[0].id } } }, // Next.js
          { tag: { connect: { id: tags[1].id } } }, // React
          { tag: { connect: { id: tags[2].id } } }, // TypeScript
        ],
      },
    },
  })

  const post2 = await prisma.post.upsert({
    where: { slug: 'getting-started-with-nextjs' },
    update: {},
    create: {
      title: 'Next.js 快速入门教程',
      slug: 'getting-started-with-nextjs',
      excerpt: '从零开始学习 Next.js，包括路由、数据获取、样式等核心概念',
      content: `# Next.js 快速入门教程

## 什么是 Next.js?

Next.js 是一个基于 React 的全栈框架，提供了:

- 服务器端渲染 (SSR)
- 静态站点生成 (SSG)
- 增量静态再生成 (ISR)
- API 路由
- 文件系统路由

## 安装

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

## 项目结构

\`\`\`
my-app/
├── src/
│   ├── app/          # App Router (Next.js 14)
│   │   ├── layout.tsx    # 根布局
│   │   └── page.tsx      # 首页
│   ├── components/   # React 组件
│   └── lib/          # 工具函数
├── public/           # 静态资源
└── package.json
\`\`\`

## 核心概念

### 1. 文件系统路由

\`\`\`
src/app/page.tsx         -> /
src/app/about/page.tsx   -> /about
src/app/blog/[slug]/page.tsx -> /blog/:slug
\`\`\`

### 2. Server Components vs Client Components

默认情况下，所有组件都是 Server Components:

\`\`\`tsx
// Server Component (默认)
export default function Page() {
  return <div>服务器组件</div>
}
\`\`\`

如需客户端交互，使用 'use client':

\`\`\`tsx
'use client'
import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
\`\`\`

### 3. 数据获取

\`\`\`tsx
// Server Component 中直接 async/await
export default async function Page() {
  const data = await fetch('https://api.example.com/data')
  const json = await data.json()
  return <div>{JSON.stringify(json)}</div>
}
\`\`\`

## 总结

Next.js 让全栈开发变得简单! 开始构建你的应用吧! 🚀`,
      published: true,
      publishedAt: new Date(),
      authorId: admin.id,
      categoryId: categories[2].id, // 教程分类
      tags: {
        create: [
          { tag: { connect: { id: tags[0].id } } }, // Next.js
          { tag: { connect: { id: tags[1].id } } }, // React
        ],
      },
    },
  })

  console.log('✅ 创建了示例文章:')
  console.log('  -', post1.title)
  console.log('  -', post2.title)

  console.log('\n✅ 数据播种完成!')
  console.log('\n📊 数据统计:')
  console.log('  - 用户数:', await prisma.user.count())
  console.log('  - 分类数:', await prisma.category.count())
  console.log('  - 标签数:', await prisma.tag.count())
  console.log('  - 文章数:', await prisma.post.count())
}

main()
  .catch((e) => {
    console.error('❌ 数据播种失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
