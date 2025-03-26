import {
  Controller,
  Get,
  Post,
  Req,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileIdInterceptor } from './interceptors/file-id-interceptor';
import { FileUploadInterceptor } from './interceptors/file-upload-interceptor';
import { Request as ExpRequest } from 'express';
import { FileRequest } from './types/file-request.type';

@Controller('segments')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  sayHello() {
    return this.appService.sayHello();
  }

  @Post()
  @UseInterceptors(FileIdInterceptor, FileUploadInterceptor)
  async getSegmentsFromFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: FileRequest,
  ) {
    const fileId = req.fileId;
    const segments = await this.appService.getSegments(fileId, file.path);

    return {
      fileId,
      segments,
    };
  }
}
