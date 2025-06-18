import {
  HttpException,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import fs from 'fs';
import OpenAI from 'openai';
import { OPEN_AI_CLIENT } from '../open-ai/constants';
import { AI_MODEL } from './constants/open-ai-params';
import { TranscriptionFormatResponse } from './types/transcription-format-response.type';
import { TranscriptionFormat } from './types/transcription-format.enum';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { isErrorHttpResponseCode } from 'src/utils/is-error-http-response';
import { TranscriptionData } from './types/transcription-data.type';
import FormData from 'form-data';
import { executeAsyncWithRetry } from 'src/utils/execute-async-with-retry';

@Injectable()
export class TranscriptionsRepository implements OnModuleInit {
  private generateFunctionByFormat: {
    [K in TranscriptionFormat]: (
      filePath: string,
    ) => Promise<TranscriptionFormatResponse[K]>;
  };

  constructor(
    @Inject(OPEN_AI_CLIENT) private readonly openAI: OpenAI,
    private readonly s3DalHttpService: HttpService,
    private readonly logger: Logger,
  ) {}

  onModuleInit() {
    this.generateFunctionByFormat = {
      [TranscriptionFormat.SRT]: (filePath) =>
        this.generateTranscriptionSRT(filePath),
      [TranscriptionFormat.JSON]: (filePath) =>
        this.generateTranscriptionJSON(filePath),
    };
  }

  generateTranscription(filePath: string, format: TranscriptionFormat) {
    return this.generateFunctionByFormat[format](filePath);
  }

  async saveTranscription(
    fileId: string,
    transcription: TranscriptionData['transcription'],
  ) {
    const bodyData = new FormData();
    bodyData.append('file', Buffer.from(transcription), {
      filename: `${fileId}.srt`,
      contentType: 'text/plain',
    });

    const { data, status } = await firstValueFrom(
      this.s3DalHttpService.post('srt', bodyData, {
        headers: bodyData.getHeaders(),
      }),
    );

    if (isErrorHttpResponseCode(status)) {
      throw new HttpException({ fileId, data }, status);
    }

    return data;
  }

  private generateTranscriptionSRT(filePath: string) {
    return executeAsyncWithRetry(
      async () => {
        const file = fs.createReadStream(filePath);

        const transcription = await this.openAI.audio.transcriptions.create({
          file,
          model: AI_MODEL,
          response_format: 'srt',
        });

        return transcription;
      },
      {
        onAttemptError: (attempt, retryCount) => {
          this.logger.warn(
            `Retrying to generating srt, attempt ${attempt}/${retryCount}`,
          );
        },
      },
    );
  }

  private generateTranscriptionJSON(filePath: string) {
    return executeAsyncWithRetry(
      async () => {
        const file = fs.createReadStream(filePath);

        const transcription = await this.openAI.audio.transcriptions.create({
          file,
          model: AI_MODEL,
          timestamp_granularities: ['segment'],
          response_format: 'verbose_json',
        });

        return transcription;
      },
      {
        onAttemptError: (attempt, retryCount) => {
          this.logger.warn(
            `Retrying to generating json, attempt ${attempt}/${retryCount}`,
          );
        },
      },
    );
  }
}
