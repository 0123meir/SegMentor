import { HttpException, Injectable } from '@nestjs/common';
import { Lecture } from './types/lecture.type';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { isErrorHttpResponseCode } from './utils/is-error-http-response';

@Injectable()
export class LecturesRepository {
  constructor(private readonly coursesApi: HttpService) {}

  async getLectureById(lectureId: Lecture['_id']) {
    const { data, status } = await firstValueFrom(
      this.coursesApi.get(`/lectures/${lectureId}`),
    );

    if (isErrorHttpResponseCode(status)) {
      throw new HttpException({ lectureId, data }, status);
    }

    return data;
  }
}
