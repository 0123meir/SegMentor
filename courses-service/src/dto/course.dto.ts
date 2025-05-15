import { IsString, IsArray, IsOptional, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true })
  lectures?: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true })
  lecturer?: string;
}

export class UpdateCourseDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ type: [String], required: false })
  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true })
  lectures?: string[];

  @ApiProperty({ type: [String], required: false })
  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true })
  lecturer?: string;
}
