const { withNextVideo } = require('next-video/process')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ["api.ajur.app", "www.api.ajur.app"],
    loader: 'akamai',
    path: '',
  },
  // For next-video optimization
  experimental: {
    outputFileTracingIncludes: {
      '/': ['./node_modules/next-video/**/*']
    }
  },
  async headers() {
    return [
      {
        source: '/.well-known/assetlinks.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json'
          }
        ],
      },
      // Add caching headers for video files
      {
        source: '/_next-video/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ]
  },
  // Remove publicRuntimeConfig as it's not needed for static files
}

module.exports = withNextVideo(nextConfig)