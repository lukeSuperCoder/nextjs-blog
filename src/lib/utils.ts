/**
 * cn - 类名合并工具函数
 *
 * @说明
 * 这个函数是 shadcn/ui 的核心工具函数,用于智能合并 Tailwind CSS 类名
 *
 * @技术原理
 * 1. clsx: 条件性地组合类名
 *    - 支持字符串、对象、数组等多种格式
 *    - 自动过滤 falsy 值 (null, undefined, false 等)
 *
 * 2. tailwind-merge: 智能合并 Tailwind 类名
 *    - 解决类名冲突问题
 *    - 后面的类名会覆盖前面的类名
 *    - 例如: 'px-2 px-4' -> 'px-4'
 *
 * @为什么需要这个函数?
 *
 * 问题: Tailwind 类名冲突
 * ```tsx
 * // ❌ 问题: px-2 和 px-4 都会被应用,导致样式冲突
 * <div className="px-2 px-4">...</div>
 * ```
 *
 * 解决方案: tailwind-merge
 * ```tsx
 * // ✅ 正确: 只应用 px-4,px-2 被移除
 * <div className={cn('px-2', 'px-4')}>...</div>
 * ```
 *
 * @使用场景
 *
 * 1. 条件类名
 * ```tsx
 * cn('base-class', isActive && 'active-class', isDisabled && 'disabled-class')
 * ```
 *
 * 2. 组件变体
 * ```tsx
 * cn('btn', variant === 'primary' && 'btn-primary', variant === 'secondary' && 'btn-secondary')
 * ```
 *
 * 3. 合并默认类名和自定义类名
 * ```tsx
 * function Button({ className, ...props }) {
 *   return <button className={cn('px-4 py-2', className)} {...props} />
 * }
 *
 * // 使用时:
 * <Button className="px-8" /> // 结果: 'py-2 px-8' (px-4 被 px-8 覆盖)
 * ```
 *
 * @实际例子
 *
 * ```tsx
 * import { cn } from '@/lib/utils'
 *
 * // 例子 1: 基础用法
 * cn('text-sm', 'text-lg') // 结果: 'text-lg'
 *
 * // 例子 2: 条件类名
 * cn('btn', isLoading && 'opacity-50') // 结果: 'btn opacity-50' (如果 isLoading 为 true)
 *
 * // 例子 3: 对象语法
 * cn('btn', {
 *   'btn-primary': variant === 'primary',
 *   'btn-disabled': isDisabled,
 * })
 *
 * // 例子 4: 数组语法
 * cn(['btn', 'btn-lg'], 'mt-4')
 * ```
 *
 * @最佳实践
 * - 在所有组件中使用 cn() 来合并类名
 * - 先写默认类名,后写可能覆盖的类名
 * - 利用条件语法简化代码
 *
 * @注意事项
 * - clsx 不会解决 Tailwind 类名冲突,必须配合 tailwind-merge 使用
 * - 只能合并 Tailwind CSS 类名,自定义 CSS 类名不会被智能合并
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
