/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'
const repoName = 'GOIA'

const nextConfig = {
  output: 'export',
  basePath: isProd ? `/${repoName}` : '',
  assetPrefix: isProd ? `/${repoName}/` : '',
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  env: {
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:8000/api/v1',
  },
}

module.exports = nextConfig
