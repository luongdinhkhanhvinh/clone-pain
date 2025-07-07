/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone only in Docker environment
  ...(process.env.DOCKER_BUILD === 'true' && { output: 'standalone' }),

  // Optimize for Docker builds
  ...(process.env.DOCKER_BUILD === 'true' && {
    experimental: {
      optimizeCss: false, // Disable CSS optimization in Docker to avoid network issues
    }
  }),

  // Exclude server folder from Next.js compilation
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }

    // Exclude server directory
    config.externals = config.externals || []
    config.externals.push({
      'drizzle-orm/postgres-js': 'commonjs drizzle-orm/postgres-js',
      'postgres': 'commonjs postgres',
    })

    return config
  },
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
