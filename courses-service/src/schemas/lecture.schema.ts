import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Lecture extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  duration: string;

  @Prop()
  videoUrl: string;
}

export const LectureSchema = SchemaFactory.createForClass(Lecture);
