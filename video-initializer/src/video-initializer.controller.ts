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

@Controller('video-initializer')
export class VideoInitializerController {
  constructor(
    private readonly videoInitializerService: VideoInitializerService,
  ) {}

  @Post('extract-mp3')
  @UseInterceptors(FileIdInterceptor, VideoUploadInterceptor)
  async extractMp3(@UploadedFile() file: File, @Req() req: FileRequest,) {
    if (!file) {
      throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
    }

    const fileId = req.fileId;
    await this.videoInitializerService.extractMp3(file.path, fileId);

    // need to find what to send back to the client
    return {
      message: 'MP3 extracted successfully',
      fileId,
    };
  }
}
