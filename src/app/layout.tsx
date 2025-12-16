/**
 * 根布局组件 (Root Layout)
 *
 * @说明
 * 这是整个应用的根布局,所有页面都会包裹在这个布局中
 *
 * @技术原理 - Next.js App Router
 * 1. layout.tsx 是 App Router 的核心概念
 * 2. 根布局必须包含 <html> 和 <body> 标签
 * 3. 嵌套布局会自动组合 (根布局 -> 子布局 -> 页面)
 * 4. 布局在页面切换时不会重新渲染 (性能优化)
 *
 * @React 18 特性
 * - 这是一个 Server Component (默认)
 * - Server Component 在服务器端渲染,不会发送 JS 到客户端
 * - 可以直接访问数据库、文件系统等后端资源
 *
 * @最佳实践
 * - 在根布局中引入全局样式
 * - 配置字体
 * - 设置元数据 (SEO)
 * - 不要在根布局中放置业务逻辑
 */

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

/**
 * 字体配置
 *
 * @技术原理 - Next.js Font Optimization
 * 1. Next.js 会自动下载字体文件到本地
 * 2. 自托管字体,无需请求 Google Fonts API
 * 3. 零布局偏移 (Zero Layout Shift)
 * 4. 自动优化字体加载性能
 *
 * @参数说明
 * - subsets: 字体子集 (latin: 拉丁字符,包括英文)
 * - variable: CSS 变量名 (可选,用于 Tailwind 配置)
 */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // 字体加载时的显示策略
})

/**
 * 页面元数据
 *
 * @技术原理 - Next.js Metadata API
 * 1. 元数据在 Server Component 中定义
 * 2. 自动生成 <head> 标签内容
 * 3. 支持动态元数据 (generateMetadata 函数)
 * 4. SEO 友好
 *
 * @SEO 最佳实践
 * - title: 页面标题 (显示在浏览器标签)
 * - description: 页面描述 (显示在搜索结果)
 * - keywords: 关键词 (帮助搜索引擎理解内容)
 * - openGraph: 社交媒体分享预览
 */
export const metadata: Metadata = {
  title: {
    default: 'Next.js Blog',
    template: '%s | Next.js Blog', // 子页面标题模板
  },
  description: '使用 Next.js 14 和 TypeScript 构建的现代博客系统',
  keywords: ['Next.js', 'React', 'TypeScript', 'Blog', 'Tailwind CSS'],
}

/**
 * 根布局组件
 *
 * @param children - 子组件 (页面内容)
 *
 * @技术细节
 * 1. 这是一个 Server Component (无 'use client' 指令)
 * 2. 在服务器端渲染,减少客户端 JS 体积
 * 3. children 会自动注入页面内容
 * 4. 布局在页面切换时保持不变 (性能优化)
 *
 * @注意事项
 * - 根布局必须有 <html> 和 <body> 标签
 * - 不能在根布局中使用 hooks (useState, useEffect 等)
 * - 如需客户端交互,使用 'use client' 创建子组件
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      {/*
        suppressHydrationWarning:
        - 禁止 React 对 html 标签的 hydration 警告
        - 因为主题切换会动态添加 'dark' 类名
        - 服务器渲染和客户端渲染可能不一致
       */}
      <body className={inter.className}>
        {/* 页面内容 */}
        {children}
      </body>
    </html>
  )
}
