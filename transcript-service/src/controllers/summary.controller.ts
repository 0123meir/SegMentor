import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { SummaryService } from 'src/services/summary.service';

@Controller()
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @Post('expand-summary')
  async expandSummary(
    @Body('shortSummary') shortSummary: string,
    @Body('topic') topic?: string,
  ): Promise<string> {
    if (!shortSummary) {
      throw new HttpException(
        'Short summary is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return await this.summaryService.expandSummary(shortSummary, topic);
    } catch (error) {
      throw new HttpException(
        'Failed to expand summary',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
