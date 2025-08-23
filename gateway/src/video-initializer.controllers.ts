import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  HttpException,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { VIDEO_INITIALIZER_URL } from './routes.constants';
import { FileInterceptor } from '@nestjs/platform-express';
import * as FormData from 'form-data';

@Controller('video-initializer')
export class VideoInitializerController {
  constructor(private readonly httpService: HttpService) {}

  @Post('extract-mp3')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
    }),
  )
  async extractMp3(
    @UploadedFile() file: Express.Multer.File,
    @Body('courseId') courseId: string,
    @Body('title') title: string,
  ) {
    if (!file) {
      throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
    }

    if (!courseId || !title) {
      throw new HttpException(
        'Lecture courseId and title is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const formData = new FormData();
      formData.append('file', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
        knownLength: file.size,
      });
      formData.append('courseId', courseId);
      formData.append('title', title);

      const headers: FormData.Headers = formData.getHeaders();
      headers['Content-Length'] = formData.getLengthSync();

      const response = await firstValueFrom(
        this.httpService.post(
          `${VIDEO_INITIALIZER_URL}/video-initializer/extract-mp3`,
          formData,
          {
            headers: {
              ...formData.getHeaders(),
              'Content-Length': formData.getLengthSync(),
            },
          },
        ),
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data ||
          'Error communicating with video initializer service',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
