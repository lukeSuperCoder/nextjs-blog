/**
 * Tailwind CSS 配置文件
 *
 * @说明
 * 这个文件配置了 Tailwind CSS 的核心功能:
 * 1. content: 指定要扫描的文件 (用于生成 CSS)
 * 2. theme: 自定义设计系统 (颜色、字体、间距等)
 * 3. plugins: 扩展 Tailwind 功能
 *
 * @技术原理
 * Tailwind 使用 JIT (Just-In-Time) 编译:
 * - 只生成实际使用的 CSS 类
 * - 开发时自动热更新
 * - 生产构建时自动优化
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  // 暗色模式配置
  // 'class' 表示通过 HTML 的 class 来切换 (例如: <html class="dark">)
  darkMode: ['class'],

  // 指定要扫描的文件路径
  // Tailwind 会扫描这些文件中使用的类名,并生成对应的 CSS
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    extend: {
      // 自定义颜色
      // 使用 CSS 变量,方便主题切换
      colors: {
        // shadcn/ui 风格的颜色系统
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },

      // 自定义圆角
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      // 自定义动画
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },

  // Tailwind 插件
  plugins: [
    // 添加 @tailwindcss/typography 插件 (用于 Markdown 样式)
    // 使用时: <div className="prose">...</div>
    require('@tailwindcss/typography'),
  ],
}
