/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'standalone', // Disabled for Windows build compatibility
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'production'
          ? 'http://backend:3001/api/:path*'
          : 'http://localhost:3001/api/:path*',
      },
    ]
  },
  images: {
    domains: ['localhost', 'backend', 'example.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
      },
      {
        protocol: 'http',
        hostname: 'backend',
        port: '3001',
      },
    ],
  },
}

module.exports = nextConfig
