import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LectureStatus = 'In Progress' | 'Done';

@Schema({ _id: false })
export class Segment {
  @Prop({ required: true })
  start: string;

  @Prop({ required: true })
  end: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  summary: string;
}

export const SegmentSchema = SchemaFactory.createForClass(Segment);

@Schema()
export class Lecture extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  date: string;

  @Prop()
  description?: string;

  @Prop({
    required: true,
    enum: ['In Progress', 'Done'],
    default: 'In Progress',
  })
  status: LectureStatus;

  @Prop({ type: [SegmentSchema], default: [] })
  segments: Segment[];
}

export const LectureSchema = SchemaFactory.createForClass(Lecture);
