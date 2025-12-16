/**
 * Prisma Client 单例实例
 *
 * @说明
 * 这个文件创建并导出一个全局的 Prisma Client 实例
 *
 * @技术原理 - 为什么需要单例模式?
 *
 * 1. 问题: 开发环境的热更新
 *    - Next.js 在开发时会频繁重新加载模块
 *    - 每次重新加载都会创建新的 Prisma Client 实例
 *    - 结果: 数据库连接数快速增长,超过限制
 *
 * 2. 解决方案: 单例模式
 *    - 将 Prisma Client 实例存储在全局变量中
 *    - globalThis 不会被热更新清除
 *    - 确保整个应用只有一个实例
 *
 * @最佳实践
 * - 开发环境: 使用全局变量缓存实例
 * - 生产环境: 直接创建实例 (没有热更新问题)
 * - 类型安全: 使用 TypeScript 声明全局变量类型
 *
 * @使用示例
 * ```typescript
 * import { prisma } from '@/lib/prisma'
 *
 * // 查询用户
 * const users = await prisma.user.findMany()
 *
 * // 创建文章
 * const post = await prisma.post.create({
 *   data: {
 *     title: '我的第一篇文章',
 *     slug: 'my-first-post',
 *     content: '文章内容...',
 *     authorId: userId,
 *     categoryId: categoryId,
 *   },
 * })
 * ```
 */

import { PrismaClient } from '@prisma/client'

/**
 * 全局类型声明
 *
 * @说明
 * 扩展 globalThis 类型,添加 prismaGlobal 属性
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * Prisma Client 实例
 *
 * @逻辑说明
 * 1. 如果全局变量中已经有实例,直接使用
 * 2. 如果没有,创建新实例
 * 3. 开发环境下,将实例保存到全局变量
 *
 * @配置选项
 * - log: 日志级别 (开发环境启用查询日志)
 * - query: 显示 SQL 查询语句 (方便调试)
 * - error: 显示错误信息
 * - warn: 显示警告信息
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  })

/**
 * 开发环境缓存
 *
 * @说明
 * 只在开发环境保存实例到全局变量
 * 生产环境不需要 (没有热更新)
 */
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
