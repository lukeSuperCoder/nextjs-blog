/**
 * Web Vitals 性能监控
 *
 * @说明
 * 使用 Next.js 的 useReportWebVitals Hook 收集核心性能指标。
 */

'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function Analytics() {
  useReportWebVitals((metric) => {
    console.log(metric)
  })

  return null
}

