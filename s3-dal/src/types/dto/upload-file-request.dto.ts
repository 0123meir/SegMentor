import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UploadFileRequestDTO {
  @IsString()
  @ApiProperty()
  fileId: string;
}
