import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VideoInitializerController } from './video-initializer.controller';
import { VideoInitializerService } from './video-initializer.service';
import { AudioUploadRepository } from './repositories/audio-upload.repository';
import { KafkaModule } from './kafka/kafka.module';
import { kafkaConfig } from './config/kafka.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [kafkaConfig],
    }),
    KafkaModule,
  ],
  controllers: [VideoInitializerController],
  providers: [VideoInitializerService, AudioUploadRepository],
})
export class AppModule {}
