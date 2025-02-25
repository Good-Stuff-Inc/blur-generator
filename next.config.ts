import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false, // Remove X-Powered-By header
  reactStrictMode: true,
  
  // Optimize image handling
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Asset compression
  compress: true,
  
  // Security focused headers (additional to middleware)
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
      ],
    },
  ],
};

export default nextConfig;
