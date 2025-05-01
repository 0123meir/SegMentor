import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Lecture, LectureSchema } from '../schemas/lecture.schema';
import { LectureController } from 'src/controllers/lecture.controller';
import { LectureService } from 'src/services/lecture.service';
import { Course, CourseSchema } from 'src/schemas/course.schema';
import {
  WatchedLecture,
  WatchedLectureSchema,
} from 'src/schemas/watched-lecture.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lecture.name, schema: LectureSchema }]),
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    MongooseModule.forFeature([
      { name: WatchedLecture.name, schema: WatchedLectureSchema },
    ]),
  ],
  controllers: [LectureController],
  providers: [LectureService],
})
export class LectureModule {}
