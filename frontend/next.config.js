/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  // Разрешаем CORS для разработки с внешних доменов (pinggy, ngrok и т.д.)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
  // Разрешаем запросы с внешних источников
  allowedDevOrigins: [
    'snhxv-107-161-91-54.a.free.pinggy.link',
    'localhost:3000',
    '127.0.0.1:3000',
  ],
};

module.exports = nextConfig;
