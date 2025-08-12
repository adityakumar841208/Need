import type { NextConfig } from "next";

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  images: {
    domains: ['unsplash.com','images.unsplash.com','ui-avatars.com','source.unsplash.com', 'res.cloudinary.com'], // Add this line
  },
};

export default nextConfig;
