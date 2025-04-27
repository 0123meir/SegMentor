import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const proxy = createProxyMiddleware({
  target: process.env.COURSES_SERVICE_URL || 'http://localhost:3002',
  changeOrigin: true,
  pathRewrite: { '^/courses': '/courses' },
});

@Injectable()
export class CoursesProxyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    proxy(req, res, next);
  }
}
