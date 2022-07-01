/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    outputStandalone: true,
  },
  images: {
    domains: ['images.unsplash.com', 'i.ytimg.com']
  }
}

module.exports = nextConfig
