console.log('=> Client ENV', {
  PORT: process?.env?.PORT || 3000,
  LOCAL: process?.env?.LOCAL,
  NEXT_PUBLIC_API_URL: process?.env?.NEXT_PUBLIC_API_URL,
});

module.exports = {
  reactStrictMode: true,
  webpack: (config) => {
    config.watchOptions.poll = 1000;
    config.watchOptions.aggregateTimeout = 1000;
    config.watchOptions.ignored = /node_modules/;

    return config;
  },
  rewrites: async () => {
    return process?.env?.LOCAL ? [
      {
        source: '/api/auth/:slug',
        destination: 'http://localhost:3001/api/auth/:slug',
      },
    ] : [];
  },
};
