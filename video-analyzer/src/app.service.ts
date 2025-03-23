import { HttpException, Injectable } from '@nestjs/common';
import { TranscriptionsService } from './modules/transcriptions/transcriptions.service';
import { SegmentsService } from './modules/segments/segments.service';

@Injectable()
export class AppService {
  constructor(
    private readonly transcriptionsService: TranscriptionsService,
    private readonly segmentsService: SegmentsService,
  ) {}
  async sayHello() {
    return 'hello';
  }

  async getSegments() {
    try {
      const transcription = await this.transcriptionsService.transcribe(
        './data/hebrew-discrete.mp3',
      );

      const segments =
        await this.segmentsService.createSegmentsFromTranscription(
          transcription,
        );

      return segments;
    } catch (error) {
      throw new HttpException(error.message, 500, { cause: error.stack });
    }
  }
}
