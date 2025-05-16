import {
  Controller,
  Post,
  Patch,
  Body,
  HttpException,
  HttpStatus,
  UsePipes,
  ValidationPipe, Req
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PERMISSIONS_URL } from './routes-constants';
import { CreateUserDto } from './dto/create-user.dts';
import { LoginUserDto } from './dto/login-user.dto';

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
