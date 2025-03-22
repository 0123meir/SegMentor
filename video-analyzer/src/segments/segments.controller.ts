import { Controller, Get } from '@nestjs/common';
import { SegmentsService } from './segments.service';

@Controller('segments')
export class SegmentsController {
  constructor(private readonly segmentsService: SegmentsService) {}

  @Get()
  getSRT() {
    //TODO: remove when saving to db is implemented
    return this.segmentsService.createSegmentsFromSRT(
      './src/The Geometry of Linear Equations (1).srt',
    );
  }
}
