/**
 * 用户注册 API
 *
 * @说明
 * 处理用户注册请求
 *
 * @路由
 * POST /api/register
 *
 * @请求体
 * {
 *   "name": "用户名",
 *   "email": "user@example.com",
 *   "password": "password123"
 * }
 *
 * @响应
 * 成功: { user: { id, name, email, role } }
 * 失败: { error: "错误消息" }
 *
 * @技术原理
 * 1. 验证输入数据
 * 2. 检查邮箱是否已存在
 * 3. 使用 bcrypt 加密密码
 * 4. 创建用户记录
 * 5. 返回用户信息
 */

import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

/**
 * POST 请求处理器
 *
 * @技术细节 - Next.js 14 Route Handlers
 * 1. 必须使用命名导出
 * 2. 接收 Request 对象
 * 3. 返回 NextResponse 对象
 * 4. 支持 async/await
 */
export async function POST(request: Request) {
  try {
    // 解析请求体
    const body = await request.json()
    const { name, email, password } = body

    // 1. 验证输入
    if (!email || !password) {
      return NextResponse.json({ error: '邮箱和密码不能为空' }, { status: 400 })
    }

    if (!name) {
      return NextResponse.json({ error: '用户名不能为空' }, { status: 400 })
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: '邮箱格式不正确' }, { status: 400 })
    }

    // 验证密码长度
    if (password.length < 6) {
      return NextResponse.json({ error: '密码至少需要 6 位' }, { status: 400 })
    }

    // 2. 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: '该邮箱已被注册' }, { status: 400 })
    }

    // 3. 加密密码
    // bcrypt.hash(密码, salt轮数)
    // salt轮数越高越安全,但也越慢 (推荐 10-12)
    const hashedPassword = await bcrypt.hash(password, 10)

    // 4. 创建用户
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'USER', // 默认角色
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    // 5. 返回成功响应
    return NextResponse.json(
      {
        message: '注册成功',
        user,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('注册错误:', error)
    return NextResponse.json({ error: '注册失败,请稍后重试' }, { status: 500 })
  }
}
