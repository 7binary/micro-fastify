console.log('[CLIENT] ENV =>', JSON.stringify({
  PORT: process?.env?.PORT || 3000,
  NEXT_PUBLIC_API_URL: process?.env?.NEXT_PUBLIC_API_URL,
  SERVICE_PORTS: process?.env?.SERVICE_PORTS,
}, null, 2));

module.exports = {
  reactStrictMode: true,
  webpack: (config) => {
    config.watchOptions.poll = 1000;
    config.watchOptions.aggregateTimeout = 1000;
    config.watchOptions.ignored = /node_modules/;

    return config;
  },
  rewrites: async () => {
    const rewrites = [];
    const servicePorts = process?.env?.SERVICE_PORTS
      ? process.env.SERVICE_PORTS.split(',')
      : null;

    if (Array.isArray(servicePorts) && servicePorts[0] && servicePorts[0].includes(':')) {
      servicePorts.forEach(servicePort => {
        const [service, port] = servicePort.split(':');
        rewrites.push({
          source: `/api/${service}/:slug`,
          destination: `http://localhost:${port}/api/${service}/:slug`,
        });
      });
    }

    console.log('[CLIENT] REWERITES =>', rewrites);

    return rewrites;
  },
};
