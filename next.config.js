/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false, // Disable React Strict Mode (can sometimes interfere with SSR)
  swcMinify: false, // Disable SWC minification (can sometimes cause issues)
  compiler: {
    removeConsole: false, // Keep console.log statements (for debugging)
  },
};

module.exports = nextConfig;
