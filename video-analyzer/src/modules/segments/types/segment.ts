import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class Segment {
  @Expose()
  @ApiProperty()
  start: string;

  @Expose()
  @ApiProperty()
  end: string;

  @Expose()
  @ApiProperty()
  title: string;

  @Expose()
  @ApiProperty()
  summary: string;
}
