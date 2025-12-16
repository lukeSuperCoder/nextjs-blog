## shadcn/ui 组件示例代码

### 这就是 shadcn/ui Button 组件的完整代码

```typescript
/**
 * Button 组件
 *
 * @说明:
 * 这个文件会被复制到 src/components/ui/button.tsx
 * 你拥有这段代码的完全控制权!
 */

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * buttonVariants: 按钮样式变体
 *
 * @技术原理:
 * 使用 class-variance-authority (cva) 管理样式变体
 * 类似于 TypeScript 的类型变体
 *
 * @优势:
 * - 类型安全
 * - 可组合
 * - 易于扩展
 */
const buttonVariants = cva(
  // 基础样式 (所有按钮共享)
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      // variant: 按钮类型
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      // size: 按钮大小
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * Button Props
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

/**
 * Button 组件
 *
 * @使用示例:
 * <Button>默认按钮</Button>
 * <Button variant="destructive">删除</Button>
 * <Button size="lg">大按钮</Button>
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

---

## 使用方式对比

### 传统组件库 (Material-UI)
```typescript
// ❌ 定制困难
import Button from '@mui/material/Button'

<Button
  variant="contained"
  sx={{
    // 需要使用特殊的 sx 语法
    backgroundColor: 'custom.main',
    '&:hover': {
      backgroundColor: 'custom.dark',
    }
  }}
>
  按钮
</Button>
```

### shadcn/ui
```typescript
// ✅ 直接修改源码
// 1. 打开 src/components/ui/button.tsx
// 2. 添加新的 variant:

const buttonVariants = cva("...", {
  variants: {
    variant: {
      default: "...",
      custom: "bg-purple-500 hover:bg-purple-600 text-white", // 👈 添加自定义样式
    },
  },
})

// 3. 使用
<Button variant="custom">按钮</Button>
```

---

## 为什么这么设计?

### shadcn/ui 的设计哲学

```typescript
/**
 * 组件库的演进
 *
 * @第一代: Bootstrap, jQuery UI
 * - 样式固定
 * - 定制困难
 *
 * @第二代: Material-UI, Ant Design
 * - 主题系统
 * - 定制稍微容易
 * - 但仍然是 "黑盒"
 *
 * @第三代: Headless UI (Radix UI, Headless UI)
 * - 只提供逻辑
 * - 样式完全自定义
 * - 但需要自己写很多代码
 *
 * @第四代: shadcn/ui
 * - 结合了第二代和第三代的优点
 * - 提供美观的默认样式
 * - 代码归你所有,可以随意修改
 * - 基于 Tailwind,定制简单
 */
```

---

## 为什么需要 class-variance-authority?

```typescript
/**
 * class-variance-authority (cva)
 *
 * @问题:
 * 手动管理组件变体很麻烦:
 */

// ❌ 传统方式
function Button({ variant, size }) {
  let className = "base-styles"

  if (variant === "default") className += " default-styles"
  if (variant === "destructive") className += " destructive-styles"

  if (size === "sm") className += " sm-styles"
  if (size === "lg") className += " lg-styles"

  return <button className={className} />
}

// ✅ 使用 cva
const buttonVariants = cva("base-styles", {
  variants: {
    variant: {
      default: "default-styles",
      destructive: "destructive-styles",
    },
    size: {
      sm: "sm-styles",
      lg: "lg-styles",
    },
  },
})

function Button({ variant, size }) {
  return <button className={buttonVariants({ variant, size })} />
}
```

**cva 的优势**:
- ✅ 类型安全 (TypeScript)
- ✅ 可组合变体
- ✅ 代码清晰
- ✅ 易于维护

---

## 实际项目中的使用

```typescript
// src/components/ui/button.tsx (你的项目中)
import { cva } from "class-variance-authority"

const buttonVariants = cva("...", {
  variants: {
    variant: {
      default: "...",
      primary: "bg-blue-500 hover:bg-blue-600",
      success: "bg-green-500 hover:bg-green-600",
      danger: "bg-red-500 hover:bg-red-600",
    },
    size: {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4",
      lg: "h-12 px-6 text-lg",
    },
    // 你可以添加更多变体!
    rounded: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      full: "rounded-full",
    },
  },
  // 组合变体
  compoundVariants: [
    {
      variant: "danger",
      size: "lg",
      className: "font-bold", // danger + lg 时添加额外样式
    },
  ],
})
```

---

## 总结: 为什么需要 cva?

1. **类型安全**: TypeScript 会检查你的 variant 和 size
2. **可维护**: 所有变体集中管理
3. **可扩展**: 轻松添加新变体
4. **组合能力**: 支持复杂的样式组合
5. **性能**: 编译时优化,运行时开销小

这就是为什么 shadcn/ui 选择使用 cva 来管理组件样式变体!
