import {
  Controller,
  Post,
  Body,
  Patch,
  HttpException,
  HttpStatus,
  UseGuards,
  SetMetadata, Req
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDocument } from '../schemas/user.schema';
import { RolesGuard } from './roles.guards';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

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
}
