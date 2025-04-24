import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { VideoInitializerService } from './video-initializer.service';
import { File } from 'multer';
import { FileIdInterceptor } from './interceptors/file-id-interceptor';
import { VideoUploadInterceptor } from './interceptors/video-upload.interceptor';
import { FileRequest } from './types/file-request.type';
import {
  ApiConsumes,
  ApiBody,
  ApiResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

@Controller('video-initializer')
export class VideoInitializerController {
  constructor(
    private readonly videoInitializerService: VideoInitializerService,
  ) {}

  @Post('extract-mp3')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'MP3 extracted and uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        fileId: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid file or file not provided',
  })
  @UseInterceptors(FileIdInterceptor, VideoUploadInterceptor)
  async extractMp3(@UploadedFile() file: File, @Req() req: FileRequest) {
    if (!file) {
      throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
    }

    const fileId = req.fileId;
    await this.videoInitializerService.extractMp3(file.path, fileId);

    return fileId;
  }
}
