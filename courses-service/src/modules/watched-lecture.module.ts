import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WatchedLectureController } from '../controllers/watched-lecture.controller';
import { WatchedLectureService } from '../services/watched-lecture.service';
import {
  WatchedLecture,
  WatchedLectureSchema,
} from '../schemas/watched-lecture.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WatchedLecture.name, schema: WatchedLectureSchema },
    ]),
  ],
  controllers: [WatchedLectureController],
  providers: [WatchedLectureService],
  exports: [WatchedLectureService],
})
export class WatchedLectureModule {}
