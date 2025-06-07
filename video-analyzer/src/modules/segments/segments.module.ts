import { Logger, Module } from '@nestjs/common';
import { OpenAIModule } from '../open-ai/open-ai.module';
import { SegmentsService } from './segments.service';

@Module({
  imports: [OpenAIModule],
  providers: [SegmentsService, Logger],
  exports: [SegmentsService],
})
export class SegmentsModule {}
