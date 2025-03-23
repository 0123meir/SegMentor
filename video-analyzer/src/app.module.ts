import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SegmentsService } from './segments/segments.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, SegmentsService],
})
export class AppModule {}
