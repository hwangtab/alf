/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // 정적 내보내기 모드에서 이미지 최적화 비활성화
    domains: [],
    formats: ['image/webp'],
    minimumCacheTTL: 60,
  }
}

module.exports = nextConfig
