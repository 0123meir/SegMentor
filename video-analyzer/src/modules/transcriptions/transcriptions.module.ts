import { Logger, Module } from '@nestjs/common';
import { AudioModule } from '../audio/audio.module';
import { OpenAIModule } from '../open-ai/open-ai.module';
import { TranscriptionsController } from './transcriptions.controller';
import { TranscriptionsRepository } from './transcriptions.repository';
import { TranscriptionsService } from './transcriptions.service';

@Module({
  imports: [OpenAIModule, AudioModule],
  controllers: [TranscriptionsController],
  providers: [TranscriptionsService, TranscriptionsRepository, Logger],
  exports: [TranscriptionsService],
})
export class TranscriptionsModule {}
