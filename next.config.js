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
      }
    ]
  }
}

module.exports = nextConfig