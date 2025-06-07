import { createProxyMiddleware } from 'http-proxy-middleware';
import { TRANSCRIPT_URL } from 'src/routes-constants';

export const transcriptProxy = createProxyMiddleware({
  target: TRANSCRIPT_URL,
  changeOrigin: true,
  pathRewrite: { '^/transcript-service': '' },
});
