import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  outputFileTracingRoot: __dirname,
  allowedDevOrigins: ['192.168.1.109'],
}

export default withPayload(nextConfig)
