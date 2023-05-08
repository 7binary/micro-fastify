module.exports = {
  reactStrictMode: true,
  webpack: (config) => {
    config.watchOptions.poll = 1000;
    config.watchOptions.aggregateTimeout = 1000;
    config.watchOptions.ignored = /node_modules/;

    return config;
  },
};
