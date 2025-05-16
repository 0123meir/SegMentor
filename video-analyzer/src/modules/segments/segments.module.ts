import { Logger, Module } from '@nestjs/common';
import { OpenAIModule } from '../open-ai/open-ai.module';
import { SegmentsService } from './segments.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Segments, SegmentsSchema } from './types/segments.schema';

@Module({
  imports: [
    OpenAIModule,
    MongooseModule.forFeature([{ name: Segments.name, schema: SegmentsSchema }]),
  ],
  providers: [SegmentsService, Logger],
  exports: [SegmentsService],
})
export class SegmentsModule {}
