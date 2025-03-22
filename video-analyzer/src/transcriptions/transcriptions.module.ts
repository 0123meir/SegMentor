import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OpenAIModule } from 'src/open-ai/open-ai.module';
import { TranscriptionsController } from './transcriptions.controller';
import { TranscriptionsService } from './transcriptions.service';

@Module({
  imports: [ConfigModule, OpenAIModule],
  controllers: [TranscriptionsController],
  providers: [TranscriptionsService, Logger],
})
export class TranscriptionsModule {}
