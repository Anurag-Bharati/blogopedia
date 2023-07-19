/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ["lh3.googleusercontent.com", "via.placeholder.com", "firebasestorage.googleapis.com"],
  },
};

module.exports = nextConfig;
