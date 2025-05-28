import {
  Controller,
  Post,
  UploadedFile,
  HttpException,
  HttpStatus,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { VideoInitializerService } from './video-initializer.service';
import {
  ApiConsumes,
  ApiBody,
  ApiResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import axios from 'axios';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'node:path';
import * as fs from 'node:fs';

export interface CoursesManagerResponseData {
  _id: string;
  date: string;
  title: string;
  description: string;
}

@Controller('video-initializer')
export class VideoInitializerController {
  constructor(
    private readonly videoInitializerService: VideoInitializerService,
  ) {}

  @Post('extract-mp3')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          callback(null, uniqueName);
        },
      }),
    }),
  )
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
        fileId: {
          type: 'string',
          example: '64b7f8e2f1a3c4d5e6f7a8b9',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid file or file not provided',
  })
  async extractMp3(
    @UploadedFile() file: Express.Multer.File,
    @Body('courseId') courseId: string,
    @Body('title') title: string,
  ): Promise<CoursesManagerResponseData> {
    if (!file) {
      throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
    }

    const lecture: CoursesManagerResponseData = (
      await axios.post<CoursesManagerResponseData>(`${process.env.COURSES_SERVICE_URL}/lectures`, {
          title,
          courseId,
        },
      )
    ).data;

    const fileId: string = lecture._id;
    const newFileName = `${fileId}.mp4`;
    const newFilePath: string = path.join(path.dirname(file.path), newFileName);
    fs.renameSync(file.path, newFilePath);
    await this.videoInitializerService.extractMp3(newFilePath, fileId);

    return lecture;
  }
}
