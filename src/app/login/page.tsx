/**
 * 登录页面
 *
 * @说明
 * 用户登录页面,使用 NextAuth.js 进行认证
 *
 * @路由
 * /login
 *
 * @技术原理
 * 1. 这是一个 Client Component (需要表单交互)
 * 2. 使用 next-auth/react 的 signIn 函数
 * 3. 使用 React Hook Form 管理表单
 * 4. 使用 Zod 验证表单数据
 *
 * @功能
 * - 邮箱/密码登录
 * - 表单验证
 * - 错误提示
 * - 自动跳转
 */

'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

/**
 * 表单验证 Schema
 *
 * @技术原理 - Zod
 * Zod 是一个 TypeScript 优先的 schema 验证库
 * - 类型安全
 * - 自动推导 TypeScript 类型
 * - 错误消息自定义
 */
const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少需要 6 位'),
})

// 从 schema 推导 TypeScript 类型
type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * React Hook Form 配置
   *
   * @技术原理
   * - register: 注册输入框
   * - handleSubmit: 处理表单提交
   * - formState.errors: 表单错误
   * - resolver: 使用 Zod 验证
   */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  /**
   * 表单提交处理
   *
   * @技术原理 - NextAuth signIn
   * 1. signIn('credentials', options)
   * 2. redirect: false - 手动处理跳转
   * 3. 返回结果包含 error 和 ok
   * 4. 成功后跳转到首页
   */
  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      setError(null)

      // 调用 NextAuth signIn
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false, // 不自动跳转
      })

      if (result?.error) {
        // 登录失败
        setError(result.error)
      } else {
        // 登录成功,跳转到首页
        router.push('/')
        router.refresh() // 刷新服务器组件
      }
    } catch (err) {
      setError('登录失败,请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        {/* 标题 */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">登录</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            欢迎回来! 请登录你的账户
          </p>
        </div>

        {/* 登录表单 */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 全局错误提示 */}
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* 邮箱输入 */}
          <div className="space-y-2">
            <Label htmlFor="email">邮箱</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              {...register('email')}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* 密码输入 */}
          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••"
              {...register('password')}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          {/* 提交按钮 */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? '登录中...' : '登录'}
          </Button>
        </form>

        {/* 注册链接 */}
        <div className="text-center text-sm">
          <span className="text-muted-foreground">还没有账户? </span>
          <Link href="/register" className="font-medium text-primary hover:underline">
            立即注册
          </Link>
        </div>

        {/* 测试账号提示 */}
        <div className="rounded-md bg-muted p-4 text-sm">
          <p className="font-medium">测试账号:</p>
          <p className="mt-1 text-muted-foreground">
            邮箱: admin@example.com
            <br />
            密码: admin123456
          </p>
        </div>
      </div>
    </div>
  )
}
