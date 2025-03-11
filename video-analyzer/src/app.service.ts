import { Injectable } from '@nestjs/common';
import { SegmentsService } from './segments/segments.service';

@Injectable()
export class AppService {
  constructor(private SegmentsService: SegmentsService) {}
  async getHealth(): Promise<any> {
  return  this.SegmentsService.createSegmentsFromSRT("./src/The Geometry of Linear Equations (1).srt")

  }
}
