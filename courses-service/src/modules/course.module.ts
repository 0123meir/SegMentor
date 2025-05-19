import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseService } from '../services/course.service';
import { CourseController } from '../controllers/course.controller';
import { Course, CourseSchema } from '../schemas/course.schema';
import { Lecture, LectureSchema } from 'src/schemas/lecture.schema';
import {
  WatchedLecture,
  WatchedLectureSchema,
} from 'src/schemas/watched-lecture.schema';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    MongooseModule.forFeature([{ name: Lecture.name, schema: LectureSchema }]),
    MongooseModule.forFeature([
      { name: WatchedLecture.name, schema: WatchedLectureSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
