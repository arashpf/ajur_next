// const { withNextVideo } = require('next-video/process')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ["api.ajur.app", "www.api.ajur.app"],
    loader: 'akamai',
    path: '',
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
    ]
  },
  publicRuntimeConfig: {
    staticFolder: '/public',
  }
}

// Export without video optimization for now
module.exports = nextConfig
