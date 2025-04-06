import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { TranscriptionVerbose } from 'openai/resources/audio/transcriptions';
import { AudioService } from '../audio/audio.service';
import { CHUNK_DURATION_SECONDS } from '../audio/constants';
import { MAX_FILE_CHUNK_SIZE_MB } from './constants/max-file-chunk-size-mb';
import { TranscriptionsRepository } from './transcriptions.repository';
import { JsonTranscriptionSegment } from './types/json-transcription-segment.type';
import { TranscriptionFormatResponse } from './types/transcription-format-response.type';
import { TranscriptionFormat } from './types/transcription-format.enum';
import { convertToSrtSegmentText } from './utils/convert-to-srt-segment-text';
import { TranscriptionData } from './types/transcription-data.type';
import langs from 'langs';
import { LANGUAGE_ISO_SPECIFICATION } from './constants/language-iso-specification';
import { BYTES_PER_MEGABYTE } from './constants/bytes_per_megabyte';

@Injectable()
export class TranscriptionsService {
  constructor(
    private readonly audioService: AudioService,
    private readonly transcriptionsRepository: TranscriptionsRepository,
    private readonly logger: Logger,
  ) {}

  async transcribe(
    fileId: string,
    file: Express.Multer.File,
  ): Promise<TranscriptionData> {
    const fileSizeBytesMB = file.size / BYTES_PER_MEGABYTE;

    const shouldSplitAudio = fileSizeBytesMB >= MAX_FILE_CHUNK_SIZE_MB;
    const filePath = file.path;

    const transcription = await (shouldSplitAudio
      ? this.transcribeAsChunks(fileId, filePath)
      : this.transcribeFile(fileId, filePath, TranscriptionFormat.SRT));

    const language = await this.getTranscriptionLanguage(fileId, transcription);

    return {
      transcription,
      language,
    };
  }

  private async transcribeAsChunks(fileId: string, filePath: string) {
    try {
      this.logger.log({ message: 'creating chunk files', fileId, filePath });
      const chunkFiles = await this.audioService.splitAudio(fileId, filePath);
      this.logger.log({ message: 'finished chunk files', fileId, filePath });

      this.logger.log({ message: 'transcribing chunks', fileId, filePath });
      const transcriptionChunks = await Promise.all(
        chunkFiles.map((file) =>
          this.transcribeFile(fileId, file, TranscriptionFormat.JSON),
        ),
      );
      this.logger.log({
        message: 'finished transcribing chunks',
        fileId,
        filePath,
      });

      return this.convertTranscriptionChunksToSRT(transcriptionChunks);
    } catch (error) {
      this.logger.error({
        message: 'error transcribing chunks',
        fileId,
        filePath,
        error,
      });

      throw error;
    } finally {
      this.audioService.removeAudioChunks(fileId);
    }
  }

  private async transcribeFile<T extends TranscriptionFormat>(
    fileId: string,
    filePath: string,
    format: T,
  ): Promise<TranscriptionFormatResponse[T]> {
    try {
      this.logger.log({
        message: 'transcribing file',
        fileId,
        filePath,
      });

      const transcription =
        await this.transcriptionsRepository.generateTranscription(
          filePath,
          format,
        );

      this.logger.log({
        message: 'finished transcribing successfully',
        fileId,
        filePath,
      });

      return transcription as TranscriptionFormatResponse[T];
    } catch (error) {
      this.logger.error({
        message: 'error transcribing',
        fileId,
        filePath,
        error,
      });

      throw error;
    }
  }

  private convertTranscriptionChunksToSRT(
    chunkTranscriptions: TranscriptionVerbose[],
  ): string {
    const recordingSegments =
      chunkTranscriptions.flatMap<JsonTranscriptionSegment>(
        (chunkTranscription, chunkIndex) => {
          const segments = chunkTranscription.segments ?? [];
          const chunkOffset = chunkIndex * CHUNK_DURATION_SECONDS;

          return segments.map((segment) => ({
            start: segment.start + chunkOffset,
            end: segment.end + chunkOffset,
            text: segment.text,
          }));
        },
      );

    return recordingSegments
      .map((segment, segmentIndex) =>
        convertToSrtSegmentText(segment, segmentIndex),
      )
      .join('');
  }

  private async getTranscriptionLanguage(
    fileId: string,
    transcription: string,
  ): Promise<string> {
    const detectLanguage = (await import('franc')).franc;

    const language = langs.where(
      LANGUAGE_ISO_SPECIFICATION,
      detectLanguage(transcription),
    )?.name;

    if (!language) {
      throw new InternalServerErrorException({
        fileId,
        message: 'transcription language is undetectable',
      });
    }

    return language;
  }
}
