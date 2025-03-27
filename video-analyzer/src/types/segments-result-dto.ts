import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Segment } from 'src/modules/segments/types/segment';

export class SegmentsResultDTO {
  @Expose()
  @ApiProperty()
  fileId: string;

  @Expose()
  @ApiProperty({ type: Segment, isArray: true })
  segments: Segment[];
}
