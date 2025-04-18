import { Controller, Post, Get, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  async createUser(
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<User> {
    return this.usersService.createUser(username, password);
  }

  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    return this.usersService.login(username, password);
  }
}
