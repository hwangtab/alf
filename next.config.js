/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    // 정적 내보내기에서도 이미지 최적화 활성화
    loader: 'custom',
    loaderFile: './src/utils/imageLoader.js',
    formats: ['image/avif', 'image/webp'], // AVIF 우선
    minimumCacheTTL: 31536000, // 1년 캐시
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // 압축 활성화
  compress: true,
  // 성능 최적화
  experimental: {
    optimizePackageImports: ['framer-motion', 'react-icons'],
  },
}

module.exports = nextConfig

// Re-commit to trigger Vercel deployment
