import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SegmentsDocument = Segments & Document;

@Schema()
export class Segments {
  @Prop({ required: true })
  fileId: string;

  @Prop({ required: true })
  start: string;

  @Prop({ required: true })
  end: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  summary: string;
}

export const SegmentsSchema = SchemaFactory.createForClass(Segments);
