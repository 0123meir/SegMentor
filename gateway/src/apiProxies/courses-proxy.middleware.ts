import { createProxyMiddleware } from 'http-proxy-middleware';

export const coursesProxy = createProxyMiddleware({
  target: process.env.COURSES_SERVICE_URL || 'http://localhost:3002',
  changeOrigin: true,
  pathRewrite: { '^/courses-service': '' },
});
