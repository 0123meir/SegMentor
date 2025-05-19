import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor() {}

  async use(req: Request, res: Response, next: NextFunction) {
    const excludedRoutes = ['/users/login', '/users'];

    if (excludedRoutes.includes(req.path)) {
      return next();
    }

    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new HttpException(
        'Authorization token missing',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'development_secret',
      ) as { role: string };

      req['role'] = decoded.role;
      next();
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Invalid token',
        error.response?.status || HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
