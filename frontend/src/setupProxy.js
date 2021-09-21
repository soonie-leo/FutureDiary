/* eslint-disable @typescript-eslint/no-var-requires */
const createProxyMiddleware = require('http-proxy-middleware');

module.exports = (app) => {
  app.use(
    createProxyMiddleware('/api/**', {
      target: 'http://localhost:5000',
      secure: false,
    }),
  );
};
