import { Injectable, Logger } from '@nestjs/common';
import fs from 'fs';
import { TranscriptionVerbose } from 'openai/resources/audio/transcriptions';
import { v4 as uuidV4 } from 'uuid';
import { AudioService } from '../audio/audio.service';
import { CHUNK_DURATION_SECONDS } from '../audio/constants';
import { MAX_FILE_CHUNK_SIZE_MB } from './constants';
import { TranscriptionsRepository } from './transcriptions.repository';
import { JsonTranscriptionSegment } from './types/json-transcription-segment.type';
import { TranscriptionFormatResponse } from './types/transcription-format-response.type';
import { TranscriptionFormat } from './types/transcription-format.enum';
import { convertToSrtSegmentText } from './utils/convert-to-srt-segment-text';

@Injectable()
export class TranscriptionsService {
  constructor(
    private readonly audioService: AudioService,
    private readonly transcriptionsRepository: TranscriptionsRepository,
    private readonly logger: Logger,
  ) {}

  async transcribe(filePath: string) {
    const fileSizeBytesMB =
      (await fs.promises.stat(filePath)).size / (1_024 * 1_024);

    const shouldSplitAudio = fileSizeBytesMB >= MAX_FILE_CHUNK_SIZE_MB;

    return shouldSplitAudio
      ? this.transcribeAsChunks(filePath)
      : this.transcribeFile(filePath, TranscriptionFormat.SRT);
  }

  private async transcribeFile<T extends TranscriptionFormat>(
    filePath: string,
    format: T,
  ): Promise<TranscriptionFormatResponse[T]> {
    try {
      this.logger.log({
        message: 'transcribing file',
        filePath,
      });

      const transcription = await (format === TranscriptionFormat.SRT
        ? this.transcriptionsRepository.generateTranscriptionSRT(filePath)
        : this.transcriptionsRepository.generateTranscriptionJSON(filePath));

      this.logger.log({
        message: 'finished transcribing successfully',
        filePath,
      });

      return transcription as TranscriptionFormatResponse[T];
    } catch (error) {
      this.logger.error({
        message: 'error transcribing',
        filePath,
        error,
      });

      throw error;
    }
  }

  private async transcribeAsChunks(filePath: string) {
    const fileId = uuidV4();

    this.logger.log({ message: 'creating chunk files', fileId, filePath });
    const chunkFiles = await this.audioService.splitAudio(fileId, filePath);
    this.logger.log({ message: 'finished chunk files', fileId, filePath });

    this.logger.log({ message: 'transcribing chunks', fileId, filePath });
    const transcriptionChunks = await Promise.all(
      chunkFiles.map((file) =>
        this.transcribeFile(file, TranscriptionFormat.JSON),
      ),
    );
    this.logger.log({
      message: 'finished transcribing chunks',
      fileId,
      filePath,
    });

    this.audioService.removeAudioChunks(fileId);

    return this.convertTranscriptionChunksToSRT(transcriptionChunks);
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
}
