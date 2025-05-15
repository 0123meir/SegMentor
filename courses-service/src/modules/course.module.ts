import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseService } from '../services/course.service';
import { CourseController } from '../controllers/course.controller';
import { Course, CourseSchema } from '../schemas/course.schema';
import { Lecture, LectureSchema } from 'src/schemas/lecture.schema';
import { Lecturer, LecturerSchema } from 'src/schemas/lecturer.schema';
import {
  WatchedLecture,
  WatchedLectureSchema,
} from 'src/schemas/watched-lecture.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    MongooseModule.forFeature([{ name: Lecture.name, schema: LectureSchema }]),
    MongooseModule.forFeature([
      { name: Lecturer.name, schema: LecturerSchema },
    ]),
    MongooseModule.forFeature([
      { name: WatchedLecture.name, schema: WatchedLectureSchema },
    ]),
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
