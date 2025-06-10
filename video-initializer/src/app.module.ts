import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VideoInitializerController } from './video-initializer.controller';
import { VideoInitializerService } from './video-initializer.service';
import { AudioUploadRepository } from './repositories/audio-upload.repository';
import { KafkaModule } from './kafka/kafka.module';
import { kafkaConfig } from './config/kafka.config';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [kafkaConfig],
    }),
    KafkaModule,
  ],
  controllers: [VideoInitializerController],
  providers: [
    VideoInitializerService,
    AudioUploadRepository,
    Logger,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
