import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VideoInitializerController } from './video-initializer.controller';
import { VideoInitializerService } from './video-initializer.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [VideoInitializerController],
  providers: [VideoInitializerService],
})
export class AppModule {}
