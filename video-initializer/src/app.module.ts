import { Module } from '@nestjs/common';
import { VideoInitializerController } from './video-initializer.controller';
import { VideoInitializerService } from './video-initializer.service';

@Module({
  imports: [],
  controllers: [VideoInitializerController],
  providers: [VideoInitializerService],
})
export class AppModule {}
