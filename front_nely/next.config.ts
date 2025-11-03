// next.config.js or next.config.mjs
// Add this configuration to allow Supabase images

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kdovjemhivvkahufqlwh.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;

// OR if you're using CommonJS (next.config.js):
// module.exports = nextConfig;