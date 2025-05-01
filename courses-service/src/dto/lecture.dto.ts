import { IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateLectureDto {
  @IsString()
  title: string;

  @IsDateString()
  date: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  duration?: string;

  @IsString()
  @IsOptional()
  videoUrl?: string;
}

export class UpdateLectureDto extends CreateLectureDto {}
