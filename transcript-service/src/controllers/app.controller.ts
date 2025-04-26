import { Controller, Get, HttpException, HttpStatus, Param, Query, Res } from '@nestjs/common';
import { S3Service } from 'src/services/s3.service';
import { Response } from 'express';
import { SearchService } from 'src/services/search.service';

@Controller()
export class AppController {
  private bucketName = 'segmentor-segmnets';
  constructor(  private readonly s3Service: S3Service,
    private readonly searchService: SearchService) {}
  
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

  
@Get('/search/:key')
async searchSrt(
  @Param('key') key: string,
  @Query('q') prompt: string,
  @Res() res: Response,
) {
  try {
    const fileContent = await this.s3Service.getFile(this.bucketName, key);
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
