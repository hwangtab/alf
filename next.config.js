/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [75, 85, 90],
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
}

module.exports = nextConfig
