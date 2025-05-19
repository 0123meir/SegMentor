import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Segment } from './segment';

export type SegmentsDocument = Segments & Document;

@Schema()
export class Segments {
  @Prop({ required: true })
  fileId: string;

  @Prop({
    type: [
      {
        start: { type: String, required: true },
        end: { type: String, required: true },
        title: { type: String, required: true },
        summary: { type: String, required: true },
      },
    ],
    required: true,
  })
  segments: Segment[];
}

export const SegmentsSchema = SchemaFactory.createForClass(Segments);
