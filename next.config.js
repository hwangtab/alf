/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // unoptimized: true, // Vercel 배포를 위해 이미지 최적화 활성화
    formats: ['image/webp'], // AVIF 제거하여 비용 절감 (원본이 이미 WebP로 최적화됨)
    deviceSizes: [640, 1080, 1920], // 6개 → 3개로 축소하여 변환 횟수 감소
    imageSizes: [64, 128, 256], // 8개 → 3개로 축소하여 변환 횟수 감소
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: 'img.stibee.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img2.stibee.com',
        pathname: '/**',
      },
    ],
  },
  compress: true,
  experimental: {
    optimizePackageImports: ['framer-motion', 'react-icons'],
  },
}

module.exports = nextConfig

// Re-commit to trigger Vercel deployment
