import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { appConfig } from './config/app.config';
import { openAIConfig } from './config/open-ai.config';
import { SegmentsModule } from './modules/segments/segments.module';
import { TranscriptionsModule } from './modules/transcriptions/transcriptions.module';
import { s3DalConfig } from './config/s3-dal.config';
import { KafkaModule } from './modules/kafka/kafka.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, openAIConfig, s3DalConfig],
    }),
    TranscriptionsModule,
    SegmentsModule,
    KafkaModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
