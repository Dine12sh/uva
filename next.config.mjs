/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://*.notion.so https://*.notion.site https://notion.so https://notion.site https://*.google.com https://*.instagram.com https://*.facebook.com https://*.apple.com https://*.icloud.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
