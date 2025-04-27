import { Logger, Module } from '@nestjs/common';
import { AudioModule } from '../audio/audio.module';
import { OpenAIModule } from '../open-ai/open-ai.module';
import { TranscriptionsRepository } from './transcriptions.repository';
import { TranscriptionsService } from './transcriptions.service';
import { HttpModule } from '@nestjs/axios';
import { S3DalConfig, s3DalConfigKey } from 'src/config/s3-dal.config';

@Module({
  imports: [
    OpenAIModule,
    AudioModule,
    HttpModule.registerAsync({
      useFactory: (config: S3DalConfig) => {
        return {
          baseURL: config.s3DalUrl,
        };
      },
      inject: [s3DalConfigKey],
    }),
  ],
  providers: [TranscriptionsService, TranscriptionsRepository, Logger],
  exports: [TranscriptionsService],
})
export class TranscriptionsModule {}
