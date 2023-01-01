/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    concurrentFeatures: true,
    experimental: {
        appDir: true,
    },
};

module.exports = nextConfig;
