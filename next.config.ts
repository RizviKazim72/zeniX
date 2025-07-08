import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        port: '',
        pathname: '/t/p/**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
  },
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
    serverComponentsExternalPackages: ['mongoose'],
  },
  // Compress output
  compress: true,
  // Enable PWA features
  generateEtags: true,
  // Production optimizations
  swcMinify: true,
  // Security headers
  poweredByHeader: false,
};

export default nextConfig;
