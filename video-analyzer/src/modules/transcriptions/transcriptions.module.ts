import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TranscriptionsController } from './transcriptions.controller';
import { TranscriptionsService } from './transcriptions.service';
import { OpenAIModule } from '../open-ai/open-ai.module';
import { AudioModule } from '../audio/audio.module';
import { TranscriptionsRepository } from './transcriptions.repository';

@Module({
  imports: [ConfigModule, OpenAIModule, AudioModule],
  controllers: [TranscriptionsController],
  providers: [TranscriptionsService, TranscriptionsRepository, Logger],
  exports: [TranscriptionsService],
})
export class TranscriptionsModule {}
