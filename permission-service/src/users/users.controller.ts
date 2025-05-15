import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDocument } from '../schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<{ user: UserDocument; token: string }> {
    return this.usersService.register(username, password);
  }

  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<{ user: UserDocument; token: string }> {
    return this.usersService.login(username, password);
  }
}
