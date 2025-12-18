/**
 * 登出按钮组件
 *
 * @说明
 * 提供用户登出功能的按钮
 *
 * @技术原理
 * 1. 这是一个 Client Component (需要交互)
 * 2. 使用 next-auth/react 的 signOut 函数
 * 3. 登出后跳转到首页
 *
 * @使用示例
 * ```tsx
 * import { LogoutButton } from '@/components/logout-button'
 *
 * <LogoutButton />
 * ```
 */

'use client'

import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'

/**
 * LogoutButton 组件
 *
 * @说明
 * 点击后登出并刷新页面
 */
export function LogoutButton() {
  const handleLogout = async () => {
    // signOut 会清除会话并触发 signOut 事件
    // callbackUrl: 登出后跳转的页面
    await signOut({
      callbackUrl: '/',
    })
  }

  return (
    <Button variant="outline" onClick={handleLogout}>
      退出登录
    </Button>
  )
}
