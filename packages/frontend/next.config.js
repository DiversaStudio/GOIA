/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  env: {
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:8000/api/v1',
  },
}

module.exports = nextConfig
