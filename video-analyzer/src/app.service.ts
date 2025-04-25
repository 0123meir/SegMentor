import { HttpException, Injectable } from '@nestjs/common';
import { unlink } from 'fs/promises';
import { noop } from 'rxjs';
import { SegmentsService } from './modules/segments/segments.service';
import { TranscriptionsService } from './modules/transcriptions/transcriptions.service';

@Injectable()
export class AppService {
  constructor(
    private readonly transcriptionsService: TranscriptionsService,
    private readonly segmentsService: SegmentsService,
  ) {}

  async getSegments(fileId: string, file: Express.Multer.File) {
    try {
      const transcriptionData = await this.transcriptionsService.transcribe(
        fileId,
        file,
      );

      await this.transcriptionsService.saveTranscription(
        fileId,
        transcriptionData.transcription,
      );

      const segments =
        await this.segmentsService.createSegmentsFromTranscription(
          fileId,
          transcriptionData,
        );

      return segments;
    } catch (error) {
      throw new HttpException(error.message, 500, { cause: error.stack });
    } finally {
      unlink(file.path).catch(noop);
    }
  }

  // // TODO: remove
  // async saveTest(
  //   fileId: string,
  //   transcription: TranscriptionData['transcription'],
  // ) {
  //   return this.transcriptionsService.saveTranscription(fileId, transcription);
  // }
}
