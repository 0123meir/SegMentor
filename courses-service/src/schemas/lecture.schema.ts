import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LectureStatus = 'In Progress' | 'Done';

@Schema()
export class Lecture extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop()
  duration?: number;

  @Prop({
    required: true,
    enum: ['In Progress', 'Done'],
    default: 'In Progress',
  })
  status: LectureStatus;
}

export const LectureSchema = SchemaFactory.createForClass(Lecture);
