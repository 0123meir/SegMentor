import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SegmentsService } from './segments.service';
import { OpenAIModule } from '../open-ai/open-ai.module';

@Module({
  imports: [ConfigModule, OpenAIModule],
  providers: [SegmentsService, Logger],
  exports: [SegmentsService],
})
export class SegmentsModule {}
