/** @type {import('next').NextConfig} */
const nextConfig = {
  // 图片优化配置
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // 开启严格模式
  reactStrictMode: true,
  // 实验性功能
  experimental: {
    // Server Actions
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
}

export default nextConfig
