import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { appConfig } from './config/app.config';
import { openAIConfig } from './config/open-ai.config';
import { FILE_UPLOAD_DIRECTORY } from './constants/file-upload-directory';
import { SegmentsModule } from './modules/segments/segments.module';
import { TranscriptionsModule } from './modules/transcriptions/transcriptions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, openAIConfig],
    }),
    TranscriptionsModule,
    SegmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
