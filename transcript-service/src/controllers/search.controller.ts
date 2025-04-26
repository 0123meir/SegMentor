import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { SearchService } from 'src/services/search.service';
import { HttpService } from '@nestjs/axios';

@Controller()
export class SearchController {
  constructor(
    private readonly s3DalHttpService: HttpService,
    private readonly searchService: SearchService,
  ) {}

  @Get('/search/:fileId')
  async searchSrt(
    @Param('fileId') fileId: string,
    @Query('q') prompt: string,
    @Res() res: Response,
  ) {
    try {
      const fileContent = await this.s3DalHttpService.get(`/srt/:${fileId}`);
      const content = fileContent?.toString() || '';
      const matches = this.searchService.findMatches(content, prompt);
      res.json(matches);
    } catch (error) {
      throw new HttpException(
        `Search failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
