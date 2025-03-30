import { Logger, Module } from '@nestjs/common';
import { AudioModule } from '../audio/audio.module';
import { OpenAIModule } from '../open-ai/open-ai.module';
import { TranscriptionsRepository } from './transcriptions.repository';
import { TranscriptionsService } from './transcriptions.service';

@Module({
  imports: [OpenAIModule, AudioModule],
  providers: [TranscriptionsService, TranscriptionsRepository, Logger],
  exports: [TranscriptionsService],
})
export class TranscriptionsModule {}
