import { createProxyMiddleware } from 'http-proxy-middleware';
import { COURSES_URL } from 'src/routes-constants';

export const coursesProxy = createProxyMiddleware({
  target: COURSES_URL,
  changeOrigin: true,
  pathRewrite: { '^/courses-service': '' },
});
