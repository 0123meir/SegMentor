import { HttpException, Injectable } from '@nestjs/common';
import { TranscriptionsService } from './modules/transcriptions/transcriptions.service';
import { SegmentsService } from './modules/segments/segments.service';
import { unlink } from 'fs/promises';

@Injectable()
export class AppService {
  constructor(
    private readonly transcriptionsService: TranscriptionsService,
    private readonly segmentsService: SegmentsService,
  ) {}
  async sayHello() {
    return { message: 'hello' };
  }

  async getSegments(fileId: string, filePath: string) {
    try {
      const transcription = await this.transcriptionsService.transcribe(
        fileId,
        filePath,
      );

      const segments =
        await this.segmentsService.createSegmentsFromTranscription(
          fileId,
          transcription,
        );

      return segments;
    } catch (error) {
      throw new HttpException(error.message, 500, { cause: error.stack });
    } finally {
      unlink(filePath);
    }
  }
}
