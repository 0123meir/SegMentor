import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserRole = 'student' | 'lecturer' | 'admin';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: ['student', 'lecturer', 'admin'] })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
