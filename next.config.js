/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // unoptimized: true, // Vercel 배포를 위해 이미지 최적화 활성화
    formats: ['image/avif', 'image/webp'], // AVIF 추가
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  compress: true,
  experimental: {
    optimizePackageImports: ['framer-motion', 'react-icons'],
  },
}

module.exports = nextConfig

// Re-commit to trigger Vercel deployment
