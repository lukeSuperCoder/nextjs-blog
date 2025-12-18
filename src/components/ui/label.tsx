/**
 * Label 组件
 *
 * @说明
 * 基于 Radix UI 的标签组件
 *
 * @技术原理
 * - 使用 @radix-ui/react-label
 * - 自动关联表单元素
 * - 支持可访问性
 *
 * @使用示例
 * ```tsx
 * <Label htmlFor="email">邮箱</Label>
 * <Input id="email" type="email" />
 * ```
 */

import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
))

Label.displayName = LabelPrimitive.Root.displayName

export { Label }
