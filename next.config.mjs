import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'unavatar.io',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/learn/:path*',
        destination: '/curriculum/:path*',
        permanent: true,
      },
      {
        source: '/courses',
        destination: '/curriculum',
        permanent: true,
      },
      {
        source: '/cirricum',
        destination: '/curriculum',
        permanent: true,
      },
      {
        source: '/curricum',
        destination: '/curriculum',
        permanent: true,
      }
    ]
  },
};

export default nextConfig;
