import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { appConfig } from './config/app.config';
import { openAIConfig } from './config/open-ai.config';
import { TranscriptionsModule } from './modules/transcriptions/transcriptions.module';
import { SegmentsModule } from './modules/segments/segments.module';
import { OpenAIModule } from './modules/open-ai/open-ai.module';
import { AudioModule } from './modules/audio/audio.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, openAIConfig],
    }),
    TranscriptionsModule,
    SegmentsModule,
    OpenAIModule,
    AudioModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
