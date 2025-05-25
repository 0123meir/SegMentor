import { Injectable, NotFoundException } from '@nestjs/common';
import { LecturesRepository } from './lectures.repository';
import { Lecture } from './types/lecture.type';

@Injectable()
export class LecturesService {
  constructor(private readonly lecturesRepository: LecturesRepository) {}

  async getLectureIfDone(
    lectureId: string,
  ): Promise<Lecture | Pick<Lecture, 'status' | '_id'>> {
    const lectureResult: Lecture =
      await this.lecturesRepository.getLectureById(lectureId);

    if (!lectureResult) {
      throw new NotFoundException({ message: 'Lecture not found', lectureId });
    }

    const { status } = lectureResult;

    if (status === 'In Progress') {
      return {
        _id: lectureId,
        status,
      };
    }

    return lectureResult;
  }
}
