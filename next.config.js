/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
