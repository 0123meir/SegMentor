import { Controller, Post, Body, Delete, Param } from '@nestjs/common';
import { WatchedLectureService } from '../services/watched-lecture.service';
import { AddWatchedLectureDto } from '../dto/watched-lecture.dto';

@Controller('watched-lectures')
export class WatchedLectureController {
  constructor(private readonly watchedLectureService: WatchedLectureService) {}

  @Post()
  add(@Body() dto: AddWatchedLectureDto) {
    return this.watchedLectureService.add(dto);
  }

  @Delete(':userId/:lectureId')
  delete(
    @Param('userId') userId: string,
    @Param('lectureId') lectureId: string,
  ) {
    return this.watchedLectureService.delete(userId, lectureId);
  }
}
