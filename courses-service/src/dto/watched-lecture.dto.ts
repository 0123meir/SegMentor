import { IsMongoId } from 'class-validator';

export class AddWatchedLectureDto {
  @IsMongoId()
  userId: string;

  @IsMongoId()
  courseId: string;

  @IsMongoId()
  lectureId: string;
}
