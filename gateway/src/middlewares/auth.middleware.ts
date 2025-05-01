import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PERMISSIONS_URL } from '../routes-constants';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly httpService: HttpService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const excludedRoutes = ['/users/login', '/users/create'];

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
      const response = await firstValueFrom(
        this.httpService.post(`${PERMISSIONS_URL}/auth/validate`, { token }),
      );

      const { role } = response.data;
      req['role'] = role;

      next();
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Invalid token',
        error.response?.status || HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
