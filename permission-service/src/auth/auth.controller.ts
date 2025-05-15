import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Controller('auth')
export class AuthController {
  @Post('validate')
  validateToken(@Body('token') token: string) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'development_secret',
      ) as { role: string };

      return { role: decoded.role };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
