import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PERMISSIONS_URL } from './routes-constants';

@Controller('users')
export class AppController {
  constructor(private readonly httpService: HttpService) {}

  @Post('create')
  async createUser(
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('role') role: string,
  ) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${PERMISSIONS_URL}/users/create`, {
          username,
          password,
          role,
        }),
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error communicating with permissions service',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${PERMISSIONS_URL}/users/login`, {
          username,
          password,
        }),
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error communicating with permissions service',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
