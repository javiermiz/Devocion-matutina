/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa';

const generatePWAConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  images: {
    domains: ['devocionmatutina.com'],
  },
};

export default generatePWAConfig(nextConfig);
