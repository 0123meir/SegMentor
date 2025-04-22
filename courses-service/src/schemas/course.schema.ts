import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Lecture } from './lecture.schema';
import { Lecturer } from './lecturer.schema';

@Schema()
export class Course extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Lecture' }] })
  lectures: Lecture[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Lecturer' })
  lecturer: Lecturer;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
