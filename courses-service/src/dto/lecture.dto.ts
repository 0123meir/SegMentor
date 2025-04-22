import { IsString, IsDateString } from 'class-validator';

export class CreateLectureDto {
  @IsString()
  title: string;

  @IsDateString()
  date: string;
}

export class UpdateLectureDto extends CreateLectureDto {}
