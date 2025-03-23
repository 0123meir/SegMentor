import { Controller, Get } from '@nestjs/common';
import { TranscriptionsService } from './transcriptions.service';

@Controller('transcriptions')
export class TranscriptionsController {
  constructor(private readonly transcriptionsService: TranscriptionsService) {}

  @Get()
  async transcribe() {
    const result = await this.transcriptionsService.transcribe(
      // './data/sample-fourier-transform.mp3',
      // './data/sample-short-muscles.mp3',
      './data/hebrew-discrete.mp3',
    );

    return {
      result,
    };
  }
}
