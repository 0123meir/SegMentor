import { Controller, Get, Logger } from '@nestjs/common';
import { TranscriptionsService } from './transcriptions.service';

@Controller('transcribe')
export class TranscriptionsController {
  constructor(private readonly transcriptionsService: TranscriptionsService) {}

  @Get()
  async transcribe() {
    // const result = await this.transcriptionsService.transcribe('')
    // return {
    //   result: this.transcriptionsService.transcribe('hi'),
    // }

    const result = await this.transcriptionsService.transcribe(
      '../../data/sample-short-muscles.mp3',
    );

    return {
      result,
    };
  }
}
