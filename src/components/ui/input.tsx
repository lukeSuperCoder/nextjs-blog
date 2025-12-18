/**
 * Input 组件
 *
 * @说明
 * 基于 shadcn/ui 风格的输入框组件
 *
 * @技术原理
 * - React.forwardRef: 允许父组件获取输入框的 ref
 * - cn(): 合并 Tailwind 类名
 * - 支持所有原生 input 属性
 *
 * @使用示例
 * ```tsx
 * <Input type="email" placeholder="请输入邮箱" />
 * <Input type="password" placeholder="请输入密码" />
 * <Input disabled placeholder="禁用状态" />
 * ```
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // 基础样式
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
          // 占位符样式
          'placeholder:text-muted-foreground',
          // 焦点样式
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          // 禁用样式
          'disabled:cursor-not-allowed disabled:opacity-50',
          // 文件输入特殊样式
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'

export { Input }
