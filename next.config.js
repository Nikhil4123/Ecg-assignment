/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed experimental.appDir as it's now stable in Next.js 14
  webpack: (config, { isServer }) => {
    // Prevent bundling optional native deps used by pdfjs in Node environments
    config.resolve = config.resolve || {}
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      canvas: false,
      fs: false,
      path: false,
    }

    return config
  },
}

module.exports = nextConfig 