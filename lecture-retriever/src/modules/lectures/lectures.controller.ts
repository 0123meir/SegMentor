import { Controller, Get, Param } from '@nestjs/common';
import { LecturesService } from './lectures.service';

@Controller('lectures')
export class LecturesController {
  constructor(private readonly lecturesService: LecturesService) {}

  @Get()
  init() {
    return { message: 'lectures' };
  }

  @Get(':id')
  async getDoneLecture(@Param('id') lectureId: string) {
    return await this.lecturesService.getLectureIfDone(lectureId);
  }
}
