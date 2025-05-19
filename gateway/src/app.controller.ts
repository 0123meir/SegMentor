import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  HttpException,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Req,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PERMISSIONS_URL } from './routes-constants';
import { CreateUserDto } from './dto/create-user.dts';
import { LoginUserDto } from './dto/login-user.dto';
import * as jwt from 'jsonwebtoken';

@Controller('users')
export class AppController {
  constructor(private readonly httpService: HttpService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${PERMISSIONS_URL}/users`, {
          username: createUserDto.username,
          password: createUserDto.password,
        }),
      );

      const { user, token } = response.data;
      const { password, ...filteredUser } = user;

      return { user: filteredUser, token };
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error communicating with permissions service',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() loginUserDto: LoginUserDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${PERMISSIONS_URL}/users/login`, {
          username: loginUserDto.username,
          password: loginUserDto.password,
        }),
      );

      const { user, token } = response.data;
      const { password, ...filteredUser } = user;

      return { user: filteredUser, token };
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error communicating with permissions service',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('me')
  async getMe(
    @Req() req: any,
  ): Promise<{ id: string; username: string; role: string }> {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw new HttpException(
        'Authorization header missing',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new HttpException('Token missing', HttpStatus.UNAUTHORIZED);
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'development_secret',
      ) as {
        id: string;
        username: string;
        role: string;
      };

      const { id, username, role } = decoded;
      return { id, username, role };
    } catch (error) {
      throw new HttpException(
        'Invalid or expired token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Patch('role')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateUserRole(
    @Body('username') username: string,
    @Body('role') role: string,
    @Req() req: Request,
  ) {
    try {
      const requesterRole = req['role'];

      const response = await firstValueFrom(
        this.httpService.patch(
          `${PERMISSIONS_URL}/users/role`,
          { username, role },
          { headers: { role: requesterRole } },
        ),
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
