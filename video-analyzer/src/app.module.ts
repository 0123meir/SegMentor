import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { appConfig } from './config/app.config';
import { kafkaConfig } from './config/kafka.config';
import { openAIConfig } from './config/open-ai.config';
import { s3DalConfig } from './config/s3-dal.config';
import { KafkaModule } from './modules/kafka/kafka.module';
import { VideoSegmentationConsumer } from './modules/kafka/video-segmentation.consumer';
import { SegmentsModule } from './modules/segments/segments.module';
import { TranscriptionsModule } from './modules/transcriptions/transcriptions.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, openAIConfig, s3DalConfig, kafkaConfig],
    }),
    TranscriptionsModule,
    SegmentsModule,
    KafkaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger,
    VideoSegmentationConsumer,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
