import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { VideoInitializerService } from './video-initializer.service';
import { File } from 'multer';
import { VideoUploadInterceptor } from './interceptors/video-upload.interceptor';

@Controller('video-initializer')
export class VideoInitializerController {
  constructor(
    private readonly videoInitializerService: VideoInitializerService,
  ) {}

  @Post('extract-mp3')
  @UseInterceptors(VideoUploadInterceptor)
  async extractMp3(@UploadedFile() file: File) {
    if (!file) {
      throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
    }

    const mp3Path = await this.videoInitializerService.extractMp3(file.path);

    // here i need to return the mp3 to the s3 and use kafka with the video id
    // for the video analyzer to process the video
    return {
      message: 'MP3 extracted successfully',
      mp3Path,
    };
  }
}
