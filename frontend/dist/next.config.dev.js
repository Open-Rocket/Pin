"use strict";

/** @type {import('next').NextConfig} */
var nextConfig = {
  reactStrictMode: true,
  images: {
    domains: []
  },
  // Разрешаем CORS для разработки с внешних доменов (pinggy, ngrok и т.д.)
  headers: function headers() {
    return regeneratorRuntime.async(function headers$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", [{
              source: '/:path*',
              headers: [{
                key: 'X-Frame-Options',
                value: 'ALLOWALL'
              }, {
                key: 'Access-Control-Allow-Origin',
                value: '*'
              }, {
                key: 'Access-Control-Allow-Methods',
                value: 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
              }, {
                key: 'Access-Control-Allow-Headers',
                value: 'Content-Type, Authorization'
              }]
            }]);

          case 1:
          case "end":
            return _context.stop();
        }
      }
    });
  },
  // Разрешаем запросы с внешних источников
  allowedDevOrigins: ['snhxv-107-161-91-54.a.free.pinggy.link', 'localhost:3000', '127.0.0.1:3000']
};
module.exports = nextConfig;