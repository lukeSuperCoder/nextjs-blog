/**
 * 注册页面
 *
 * @说明
 * 用户注册页面
 *
 * @路由
 * /register
 *
 * @技术原理
 * 1. 这是一个 Client Component (需要表单交互)
 * 2. 调用 /api/register API 创建用户
 * 3. 注册成功后自动登录
 * 4. 使用 React Hook Form + Zod 验证
 *
 * @功能
 * - 用户名/邮箱/密码注册
 * - 表单验证
 * - 错误提示
 * - 自动登录并跳转
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
 */
const registerSchema = z.object({
  name: z.string().min(2, '用户名至少需要 2 个字符'),
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少需要 6 位'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: '两次输入的密码不一致',
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  /**
   * 表单提交处理
   *
   * @流程
   * 1. 调用注册 API
   * 2. 如果成功,自动登录
   * 3. 跳转到首页
   */
  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true)
      setError(null)

      // 1. 调用注册 API
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        // 注册失败
        setError(result.error || '注册失败')
        return
      }

      // 2. 注册成功,自动登录
      const signInResult = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (signInResult?.error) {
        // 登录失败(但注册成功了)
        setError('注册成功,但自动登录失败,请手动登录')
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else {
        // 登录成功,跳转到首页
        router.push('/')
        router.refresh()
      }
    } catch (err) {
      setError('注册失败,请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        {/* 标题 */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">注册</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            创建你的账户,开始使用博客系统
          </p>
        </div>

        {/* 注册表单 */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 全局错误提示 */}
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* 用户名输入 */}
          <div className="space-y-2">
            <Label htmlFor="name">用户名</Label>
            <Input
              id="name"
              type="text"
              placeholder="你的名字"
              {...register('name')}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

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

          {/* 确认密码输入 */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">确认密码</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••"
              {...register('confirmPassword')}
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* 提交按钮 */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? '注册中...' : '注册'}
          </Button>
        </form>

        {/* 登录链接 */}
        <div className="text-center text-sm">
          <span className="text-muted-foreground">已有账户? </span>
          <Link href="/login" className="font-medium text-primary hover:underline">
            立即登录
          </Link>
        </div>
      </div>
    </div>
  )
}
