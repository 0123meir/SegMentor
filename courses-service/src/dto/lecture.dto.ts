import {
  IsString,
  IsDateString,
  IsOptional,
  IsEnum,
  IsNumber,
} from 'class-validator';

export class CreateLectureDto {
  @IsString()
  title: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  durationinMS?: number;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsEnum(['In Progress', 'Done'])
  status: 'In Progress' | 'Done';
}

export class UpdateLectureDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  durationinMS?: number;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsEnum(['In Progress', 'Done'])
  status?: 'In Progress' | 'Done';
}
