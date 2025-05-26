import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserType } from './UserType';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async register(
    username: string,
    password: string,
  ): Promise<{ user: UserType; token: string }> {
    const existingUser = await this.userModel.findOne({ username });

    if (existingUser) {
      throw new Error('Username is already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({
      username,
      password: hashedPassword,
      role: 'student',
    });

    const savedUser = await user.save();

    const token = jwt.sign(
      { id: savedUser._id, username: savedUser.username, role: savedUser.role },
      process.env.JWT_SECRET || 'development_secret',
      { expiresIn: '24h' },
    );

    const { _id: id, ...rest } = user.toObject();
    const transformedUser: UserType = { id, ...rest };

    return { user: transformedUser, token };
  }

  async login(
    username: string,
    password: string,
  ): Promise<{ user: UserType; token: string }> {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'development_secret',
      { expiresIn: '24h' },
    );

    const { _id: id, ...rest } = user.toObject();
    const transformedUser: UserType = { id, ...rest };

    return { user: transformedUser, token };
  }

  async updateUserRole(username: string, role: string): Promise<boolean> {
    const user = await this.userModel.findOne({ username });
    if (!user) return false;

    user.role = role;
    await user.save();
    return true;
  }

  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).exec();
  }
}
