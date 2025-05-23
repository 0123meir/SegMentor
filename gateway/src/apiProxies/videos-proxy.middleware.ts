import { createProxyMiddleware } from 'http-proxy-middleware';

export const videosProxy = createProxyMiddleware({
  target: process.env.S3_DAL_URL || 'http://localhost:3005',
  changeOrigin: true,
  pathRewrite: { '^/videos-service': '' },
});
