import {
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileIdInterceptor } from './interceptors/file-id-interceptor';
import { FileUploadInterceptor } from './interceptors/file-upload-interceptor';
import { FileRequest } from './types/file-request.type';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { SegmentsResultDTO } from './types/segments-result-dto';
import { ALLOWED_FILE_MIME_TYPES } from './constants/allowed-file-mime-types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  sayHello() {
    return this.appService.sayHello();
  }

  @Post('segments')
  @ApiTags('Segments')
  @ApiExtraModels(SegmentsResultDTO)
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
    },
  })
  @ApiCreatedResponse({
    description: 'Successfully created segments',
    schema: {
      $ref: getSchemaPath(SegmentsResultDTO),
    },
  })
  @ApiBadRequestResponse({
    description: `Invalid file mime type, only supports ${ALLOWED_FILE_MIME_TYPES.join(', ')}`,
  })
  @UseInterceptors(FileIdInterceptor, FileUploadInterceptor)
  async getSegmentsFromFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: FileRequest,
  ) {
    const fileId = req.fileId;
    const segments = await this.appService.getSegments(fileId, file);

    return {
      fileId,
      segments,
    };
  }
}
