import {
  Controller,
  Post,
  Get,
  UploadedFile,
  Param,
  Res,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors } from '@nestjs/common';
import { S3Service } from './s3.service';

@Controller('s3')
export class S3Controller {
  private bucketName = 'segmentor-segmnets';
  constructor(private readonly s3Service: S3Service) {}

  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      const { buffer, originalname } = file;
      const result = await this.s3Service.uploadFile(
        this.bucketName,
        originalname,
        buffer,
      );
      return {
        message: 'File uploaded successfully',
        url: result.$metadata,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'File upload failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/:key')
  async getSrt(@Param('key') key: string, @Res() res: Response) {
    try {
      const fileContent = await this.s3Service.getFile(this.bucketName, key);
      res.send(fileContent);
    } catch (error) {
      throw new HttpException(
        `File processing failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
