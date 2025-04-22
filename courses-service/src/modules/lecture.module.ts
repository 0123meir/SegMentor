import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Lecture, LectureSchema } from '../schemas/lecture.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lecture.name, schema: LectureSchema }]),
  ],
  exports: [MongooseModule],
})
export class LectureModule {}
