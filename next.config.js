/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {},
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oydbzlhmjshoiffxynmg.supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'trae-api-sg.mchost.guru',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'gyxnyouyeiztvfdeiwpo.supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
