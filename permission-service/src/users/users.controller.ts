import {
  Controller,
  Post,
  Body,
  Patch,
  HttpException,
  HttpStatus,
  UseGuards,
  SetMetadata,
  Get,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RolesGuard } from './roles.guards';
import { UserType } from './UserType';
import * as jwt from 'jsonwebtoken';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<{ user: UserType; token: string }> {
    return this.usersService.register(username, password);
  }

  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<{ user: UserType; token: string }> {
    return this.usersService.login(username, password);
  }

  @Patch('role')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async updateUserRole(
    @Body('username') username: string,
    @Body('role') role: string,
  ): Promise<{ message: string }> {
    const allowedRoles: string[] = ['student', 'lecturer'];

    if (!allowedRoles.includes(role)) {
      throw new HttpException('Invalid role', HttpStatus.BAD_REQUEST);
    }

    const updated = await this.usersService.updateUserRole(username, role);
    if (!updated) {
      throw new HttpException(
        'User not found or role not updated',
        HttpStatus.NOT_FOUND,
      );
    }

    return { message: `User ${username}'s role updated to ${role}` };
  }

  @Get('me')
  async getMe(@Headers('authorization') auth: string) {
    const token = auth?.split(' ')[1];
    return this.usersService.getCurrentUser(token);
  }
}
