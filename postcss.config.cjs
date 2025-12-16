/**
 * PostCSS 配置文件
 *
 * @说明
 * PostCSS 是一个 CSS 处理工具,通过插件转换 CSS
 *
 * @技术原理
 * 1. tailwindcss: 处理 Tailwind 指令 (@tailwind, @apply 等)
 * 2. autoprefixer: 自动添加浏览器前缀 (-webkit-, -moz- 等)
 *
 * @最佳实践
 * - Next.js 自动识别并使用这个配置
 * - 在构建时自动优化 CSS
 */

module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
