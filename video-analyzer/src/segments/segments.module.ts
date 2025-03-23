import { Module } from '@nestjs/common';
import { SegmentsService } from './segments.service';

@Module({
  providers: [SegmentsService],
  exports: [SegmentsService],
})
export class SegmentsModule {}
