/**
 * Button 组件
 *
 * @说明
 * 这是一个基于 shadcn/ui 风格的按钮组件
 * 代码在你的项目中,你拥有完全的控制权!
 *
 * @技术原理
 *
 * 1. class-variance-authority (cva)
 *    - 管理组件样式变体
 *    - 类型安全的样式组合
 *    - 类似于 TypeScript 的类型变体
 *
 * 2. @radix-ui/react-slot
 *    - 实现组件多态 (asChild 模式)
 *    - 允许按钮渲染为其他元素
 *    - 保持所有功能和样式
 *
 * 3. React.forwardRef
 *    - 允许父组件获取按钮的 DOM 引用
 *    - 必须用于需要 ref 的组件
 *    - 例如: 焦点管理、DOM 测量
 *
 * @为什么使用 cva?
 *
 * 传统方式 (不推荐):
 * ```tsx
 * function Button({ variant, size }) {
 *   let className = 'base-class'
 *   if (variant === 'primary') className += ' primary-class'
 *   if (size === 'lg') className += ' lg-class'
 *   return <button className={className} />
 * }
 * ```
 *
 * 使用 cva (推荐):
 * ```tsx
 * const buttonVariants = cva('base-class', {
 *   variants: {
 *     variant: { primary: 'primary-class' },
 *     size: { lg: 'lg-class' },
 *   },
 * })
 * ```
 *
 * 优势:
 * - ✅ 类型安全 (TypeScript 会检查 variant 和 size)
 * - ✅ 代码清晰,易于维护
 * - ✅ 支持复杂的变体组合
 * - ✅ 可以轻松添加新变体
 *
 * @使用示例
 *
 * ```tsx
 * import { Button } from '@/components/ui/button'
 *
 * // 基础用法
 * <Button>点击我</Button>
 *
 * // 不同变体
 * <Button variant="destructive">删除</Button>
 * <Button variant="outline">取消</Button>
 * <Button variant="ghost">关闭</Button>
 *
 * // 不同大小
 * <Button size="sm">小按钮</Button>
 * <Button size="lg">大按钮</Button>
 * <Button size="icon"><Icon /></Button>
 *
 * // 组合使用
 * <Button variant="outline" size="lg">大号边框按钮</Button>
 *
 * // 自定义类名 (会智能合并)
 * <Button className="mt-4">带外边距的按钮</Button>
 *
 * // asChild 模式 (渲染为其他元素)
 * <Button asChild>
 *   <a href="/about">关于我们</a>
 * </Button>
 * // 结果: <a> 元素具有按钮的所有样式
 * ```
 *
 * @定制方法
 *
 * 1. 修改现有变体
 * ```tsx
 * // 找到 buttonVariants,修改对应的样式
 * variant: {
 *   default: "bg-purple-500 hover:bg-purple-600", // 改成紫色
 * }
 * ```
 *
 * 2. 添加新变体
 * ```tsx
 * variant: {
 *   default: "...",
 *   success: "bg-green-500 hover:bg-green-600 text-white", // 新增成功样式
 * }
 * ```
 *
 * 3. 修改圆角大小
 * ```tsx
 * // 在基础样式中修改 rounded-md
 * "rounded-full" // 改成圆形
 * ```
 */

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

/**
 * 按钮样式变体定义
 *
 * @参数说明
 * 第一个参数: 基础样式 (所有按钮共享)
 * 第二个参数: 配置对象
 *   - variants: 样式变体
 *   - defaultVariants: 默认变体
 */
const buttonVariants = cva(
  // 基础样式 (所有按钮都有这些样式)
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      /**
       * variant: 按钮类型
       *
       * - default: 主要按钮 (深色背景)
       * - destructive: 危险操作 (红色,用于删除等)
       * - outline: 边框按钮 (透明背景 + 边框)
       * - secondary: 次要按钮 (浅色背景)
       * - ghost: 幽灵按钮 (无背景,仅悬停时显示)
       * - link: 链接样式 (带下划线)
       */
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },

      /**
       * size: 按钮大小
       *
       * - default: 默认大小
       * - sm: 小按钮
       * - lg: 大按钮
       * - icon: 图标按钮 (正方形)
       */
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },

    // 默认变体 (不指定时使用)
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

/**
 * Button Props 类型定义
 *
 * @说明
 * 1. 继承原生 button 元素的所有属性
 * 2. 添加 cva 变体属性 (variant, size)
 * 3. 添加 asChild 属性 (组件多态)
 *
 * @技术细节
 * - React.ButtonHTMLAttributes<HTMLButtonElement>: 原生 button 属性
 * - VariantProps<typeof buttonVariants>: cva 变体属性 (类型安全)
 * - asChild: 是否渲染为子元素 (使用 Slot)
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

/**
 * Button 组件
 *
 * @技术细节
 *
 * 1. React.forwardRef
 *    - 允许父组件通过 ref 访问按钮 DOM
 *    - 例如: const btnRef = useRef(); <Button ref={btnRef} />
 *
 * 2. asChild 模式
 *    - asChild=true: 渲染为子元素 (使用 Slot)
 *    - asChild=false: 渲染为 <button> (默认)
 *
 * 3. cn() 类名合并
 *    - 合并 cva 生成的类名和自定义 className
 *    - 智能处理 Tailwind 类名冲突
 *
 * @最佳实践
 * - 优先使用 variant 和 size prop,而不是自定义 className
 * - 只在必要时使用 className (例如: 外边距)
 * - 使用 asChild 实现组件多态 (例如: 按钮外观的链接)
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // 根据 asChild 决定渲染的元素类型
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)

// 设置组件显示名称 (用于 React DevTools)
Button.displayName = 'Button'

// 导出组件和样式变体函数
export { Button, buttonVariants }
