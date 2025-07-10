/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ["api.ajur.app", "www.api.ajur.app"],
    loader: 'akamai',
<<<<<<< HEAD
    path: '/',
=======
    path: '',
>>>>>>> a6b1c29616623faba10577384ad1bca1dcbff403
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
<<<<<<< HEAD
  },
 webpack(config) {
  config.module.rules.push({
    test: /\.svg$/,
    issuer: /\.[jt]sx?$/,
    use: ["@svgr/webpack"],
  });
  return config;
}

}

module.exports = nextConfig;
=======
  }
}

module.exports = nextConfig
>>>>>>> a6b1c29616623faba10577384ad1bca1dcbff403
