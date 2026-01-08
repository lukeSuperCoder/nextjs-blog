/**
 * 通用返回按钮
 *
 * @说明
 * - 优先使用浏览器 history 返回
 * - 如果无法返回，使用 fallbackHref
 */

'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BackButtonProps {
  label?: string
  fallbackHref?: string
  className?: string
}

export function BackButton({
  label = '返回',
  fallbackHref = '/',
  className,
}: BackButtonProps) {
  const router = useRouter()

  return (
    <Button asChild variant="ghost" className={className}>
      <Link
        href={fallbackHref}
        className="flex items-center"
        onClick={(e) => {
          if (typeof window !== 'undefined' && window.history.length > 1) {
            e.preventDefault()
            router.back()
          }
        }}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {label}
      </Link>
    </Button>
  )
}
