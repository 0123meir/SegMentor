import { createProxyMiddleware } from 'http-proxy-middleware';

export const transcriptProxy = createProxyMiddleware({
  target: process.env.TRANSCRIPT_SERVICE_URL || 'http://localhost:3006',
  changeOrigin: true,
  pathRewrite: {
    '^/transcript-service': '',
  },
});

