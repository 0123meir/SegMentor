import { HttpException, Injectable } from '@nestjs/common';
import { unlink } from 'fs/promises';
import { SegmentsService } from './modules/segments/segments.service';
import { TranscriptionsService } from './modules/transcriptions/transcriptions.service';

@Injectable()
export class AppService {
  constructor(
    private readonly transcriptionsService: TranscriptionsService,
    private readonly segmentsService: SegmentsService,
  ) {}
  async sayHello() {
    return { message: 'hello' };
  }

  async getSegments(fileId: string, file: Express.Multer.File) {
    try {
      const transcription = await this.transcriptionsService.transcribe(
        fileId,
        file,
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
      unlink(file.path);
    }
  }
}
