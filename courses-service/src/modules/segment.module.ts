import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SegmentController } from '../controllers/segment.controller';
import { SegmentService } from '../services/segment.service';
import { Lecture, LectureSchema } from '../schemas/lecture.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lecture.name, schema: LectureSchema }]),
  ],
  controllers: [SegmentController],
  providers: [SegmentService],
})
export class SegmentModule {}
