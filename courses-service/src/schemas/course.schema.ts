import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

@Schema()
export class Course extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Lecture' }] })
  lectures: Types.ObjectId[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Lecturer' })
  lecturer: Types.ObjectId[];
}

export const CourseSchema = SchemaFactory.createForClass(Course);
