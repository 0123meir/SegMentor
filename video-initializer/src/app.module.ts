import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VideoInitializerController } from './video-initializer.controller';
import { VideoInitializerService } from './video-initializer.service';
import { AudioUploadRepository } from './repositories/audio-upload.repository';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    KafkaModule,
  ],
  controllers: [VideoInitializerController],
  providers: [VideoInitializerService, AudioUploadRepository],
})
export class AppModule {}
