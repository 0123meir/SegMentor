import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WatchedLecture } from '../schemas/watched-lecture.schema';
import { AddWatchedLectureDto } from '../dto/watched-lecture.dto';

@Injectable()
export class WatchedLectureService {
  constructor(
    @InjectModel(WatchedLecture.name)
    private watchedLectureModel: Model<WatchedLecture>,
  ) {}

  async add(dto: AddWatchedLectureDto): Promise<WatchedLecture> {
    return this.watchedLectureModel.create(dto);
  }

  async delete(
    userId: string,
    lectureId: string,
  ): Promise<{ deleted: boolean }> {
    const result = await this.watchedLectureModel.deleteOne({
      userId,
      lectureId,
    });
    return { deleted: result.deletedCount > 0 };
  }
}
