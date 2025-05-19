import { IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateLectureDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(['In Progress', 'Done'])
  status: 'In Progress' | 'Done';
}

export class UpdateLectureDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['In Progress', 'Done'])
  status?: 'In Progress' | 'Done';
}
