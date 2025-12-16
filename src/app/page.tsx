import { Button } from "@/components/ui/button"
/**
 * 首页组件
 *
 * @说明
 * 这是应用的首页 (对应路由: /)
 *
 * @技术原理 - Next.js App Router
 * 1. page.tsx 定义路由页面
 * 2. 文件系统路由: src/app/page.tsx -> /
 * 3. 默认是 Server Component
 *
 * @当前状态
 * 这是一个临时页面,用于测试项目配置是否正确
 * 后续会根据开发计划实现完整的首页
 */

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Next.js Blog</h1>
        <p className="text-lg text-muted-foreground mb-8">
          项目初始化完成!开始构建你的博客系统
        </p>

        <div className="flex gap-4 justify-center">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">✅ 项目初始化</h2>
            <p className="text-sm text-muted-foreground">Next.js + TypeScript</p>
          </div>

          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">✅ 样式配置</h2>
            <p className="text-sm text-muted-foreground">Tailwind CSS</p>
          </div>

          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">⏳ 数据库</h2>
            <p className="text-sm text-muted-foreground">待配置 Prisma + PostgreSQL</p>
          </div>
        </div>
        <div className="p-4">
          <Button variant="default" size="lg">开始使用</Button>
        </div>
      </div>
    </main>
  )
}
