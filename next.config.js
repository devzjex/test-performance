const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  productionBrowserSourceMaps: false,
  webpack(config, { isServer }) {
    config.optimization.minimize = true;
    config.cache = false;

    const generateRandomName = (prefix) => {
      const randomSuffix = Math.random().toString(36).substr(2, 5);
      return `${prefix}-${randomSuffix}`;
    };

    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 5,
        maxAsyncRequests: 5,
        minSize: 20000,
        cacheGroups: {
          antd: {
            test: /[\\/]node_modules[\\/](@ant-design|antd)[\\/]/,
            name: (module, chunks, cacheGroupKey) => {
              const context = module.context || '';
              const matchResult = context.match(/node_modules\/(.*)/);
              if (matchResult) {
                return generateRandomName('an');
              }
              return generateRandomName('an-default');
            },
            chunks: 'all',
            priority: 10,
            enforce: true,
          },
          recharts: {
            test: /[\\/]node_modules[\\/](recharts)[\\/]/,
            name: (module, chunks, cacheGroupKey) => {
              const context = module.context || '';
              const matchResult = context.match(/node_modules\/(.*)/);
              if (matchResult) {
                return generateRandomName('re');
              }
              return generateRandomName('re-default');
            },
            chunks: 'all',
            priority: 10,
            enforce: true,
          },
        },
      };
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'letsmetrix.com',
        port: '',
        pathname: '/admin-blog/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        port: '',
        pathname: '/app-store/listing_images/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.letsmetrix.com',
        port: '',
        pathname: '/app-store/listing_images/**',
      },
      {
        protocol: 'https',
        hostname: 'api-wix.letsmetrix.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'storeleads.app',
        port: '',
        pathname: '/img/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        port: '',
        pathname: '/app-store/**',
      },
      {
        protocol: 'https',
        hostname: 'apps.shopifycdn.com',
        port: '',
        pathname: '/listing_images/**',
      },
      {
        protocol: 'https',
        hostname: 'storeleads.app',
        port: '',
        pathname: '/technologies/**',
      },
    ],
    formats: ['image/webp'],
    minimumCacheTTL: 31536000,
  },
};

module.exports = withBundleAnalyzer(nextConfig);
