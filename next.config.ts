import type { NextConfig } from 'next'

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055'

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  outputFileTracingRoot: __dirname,
  allowedDevOrigins: ['192.168.1.109'],
  async rewrites() {
    return [
      { source: '/cms-assets/:path*', destination: `${DIRECTUS_URL}/assets/:path*` },
    ]
  },
}

export default nextConfig
