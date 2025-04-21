/** @type {import('next').NextConfig} */
const nextConfig = {
  // 공통 설정
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production', // 프로덕션에서 콘솔 로그 제거
  },
  
  // 개발 환경과 프로덕션 환경에서 다른 설정 사용
  ...(process.env.NODE_ENV === 'production' ? {
    output: 'export',  // Static HTML 내보내기 설정 (프로덕션 환경에서만)
    images: {
      unoptimized: true,  // GitHub Pages용 이미지 최적화 비활성화
    },
    // basePath: '/art-liberation-front',  // 커스텀 도메인 사용 시 불필요
    // assetPrefix: '/art-liberation-front/',  // 커스텀 도메인 사용 시 불필요
    trailingSlash: true,  // GitHub Pages 호환성 문제 해결
    // 프로덕션 환경에서 추가 최적화
    experimental: {
      optimizePackageImports: ['framer-motion'], // 패키지 임포트 최적화
    },
  } : {
    // 개발 환경에서는 기본 설정 사용
    images: {
      // domains: ['localhost'], // Deprecated: 제거됨. 로컬 이미지는 자동 허용됨.
      deviceSizes: [640, 750, 828, 1080, 1200], // 이미지 크기 최적화
      imageSizes: [16, 32, 48, 64, 96], // 이미지 크기 최적화
      // 외부 이미지 호스트 허용 (YouTube 썸네일)
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'img.youtube.com',
          port: '',
          pathname: '/vi/**',
        },
      ],
    },
  }),
};

module.exports = nextConfig;
