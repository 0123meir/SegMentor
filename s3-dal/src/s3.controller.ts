import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { uploadFileRequestSwaggerSchema } from './constants/upload-file-request-swagger-schema';
import {
  DiskStorageFileInterceptor,
  MemoryStorageFileInterceptor,
} from './interceptors';
import { ParseInMemoryFilePipe } from './pipes/parse-in-memory-file.pipe';
import { S3Service } from './s3.service';
import { FileUploadStrategy } from './types/file-upload-strategy.enum';
import { FileType } from './types/file.type';
import { S3Bucket } from './types/s3-bucket.enum';
import { getSwaggerSupportedFileTypes } from './utils/get-swagger-supported-file-types';

@Controller()
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post('/srt')
  @ApiTags('SRT Transcriptions')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: uploadFileRequestSwaggerSchema,
  })
  @ApiBadRequestResponse({
    description: `Invalid file type, only supports ${getSwaggerSupportedFileTypes([FileType.SRT])}`,
  })
  @UseInterceptors(MemoryStorageFileInterceptor())
  async uploadSrt(
    @UploadedFile(new ParseInMemoryFilePipe([FileType.SRT]))
    file: Express.Multer.File,
  ) {
    const result = await this.s3Service.uploadFile(
      file,
      FileUploadStrategy.IN_MEMORY,
      S3Bucket.SRT_TRANSCRIPTIONS,
    );

    return {
      message: 'File uploaded successfully',
      url: result,
    };
  }

  @Post('/audio')
  @ApiTags('Audio')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: uploadFileRequestSwaggerSchema,
  })
  @ApiBadRequestResponse({
    description: `Invalid file type, only supports ${getSwaggerSupportedFileTypes([FileType.MP3])}`,
  })
  @UseInterceptors(DiskStorageFileInterceptor([FileType.MP3]))
  async uploadMp3(@UploadedFile() file: Express.Multer.File) {
    const result = await this.s3Service.uploadFile(
      file,
      FileUploadStrategy.DISK,
      S3Bucket.RAW_AUDIO,
    );

    return {
      message: 'File uploaded successfully',
      url: result,
    };
  }

  @Get('/srt/:fileId')
  @ApiTags('SRT Transcriptions')
  @ApiOkResponse({
    type: String,
    description: 'File contents of requested SRT file',
  })
  async getSrt(@Param('fileId') fileId: string, @Res() res: Response) {
    const fileContent = await this.s3Service.getFile(
      S3Bucket.SRT_TRANSCRIPTIONS,
      fileId,
      FileType.SRT,
    );

    res.send(fileContent);
  }

  @Get('/audio/:fileId')
  @ApiTags('Audio')
  @ApiOkResponse({
    type: String,
    description: 'File contents of requested MP3 file',
  })
  async getRawAudio(@Param('fileId') fileId: string, @Res() res: Response) {
    const fileContent = await this.s3Service.getFile(
      S3Bucket.RAW_AUDIO,
      fileId,
      FileType.MP3,
    );

    res.send(fileContent);
  }
}
