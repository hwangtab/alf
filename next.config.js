/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // 긴급: 402 에러 해결 - Vercel 이미지 최적화 할당량 초과
    // formats: ['image/webp'], // unoptimized 모드에서는 사용 안 됨
    // deviceSizes: [640, 1080, 1920],
    // imageSizes: [64, 128, 256],
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
