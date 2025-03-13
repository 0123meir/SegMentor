import { Injectable } from '@nestjs/common';
import { SegmentsService } from './segments/segments.service';

@Injectable()
export class AppService {
  constructor(private SegmentsService: SegmentsService) {}
  async getSegments(): Promise<JSON> {
    //TODO: remove when saving to db is implemented
    return this.SegmentsService.createSegmentsFromSRT(
      './src/The Geometry of Linear Equations (1).srt',
    );
  }
}
