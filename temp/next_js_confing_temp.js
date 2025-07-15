const { withNextVideo } = require('next-video/process')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    // Remove protocol from domains array
    domains: ["api.ajur.app", "www.api.ajur.app"],
    loader: 'akamai',
    path: '',
  },
  // Add headers for assetlinks.json
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
  // Enable static file serving from public folder
  publicRuntimeConfig: {
    staticFolder: '/public',
  }
}

module.exports = withNextVideo(nextConfig)