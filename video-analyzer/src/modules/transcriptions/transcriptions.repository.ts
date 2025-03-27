import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import fs from 'fs';
import OpenAI from 'openai';
import { OPEN_AI_CLIENT } from '../open-ai/constants';
import { AI_MODEL } from './constants/open-ai-params';
import { TranscriptionFormatResponse } from './types/transcription-format-response.type';
import { TranscriptionFormat } from './types/transcription-format.enum';

@Injectable()
export class TranscriptionsRepository implements OnModuleInit {
  private generateFunctionByFormat: {
    [K in TranscriptionFormat]: (
      filePath: string,
    ) => Promise<TranscriptionFormatResponse[K]>;
  };

  constructor(@Inject(OPEN_AI_CLIENT) private readonly openAI: OpenAI) {}

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

  private async generateTranscriptionSRT(filePath: string) {
    const file = fs.createReadStream(filePath);

    const transcription = await this.openAI.audio.transcriptions.create({
      file,
      model: AI_MODEL,
      response_format: 'srt',
    });

    return transcription;
  }

  private async generateTranscriptionJSON(filePath: string) {
    const file = fs.createReadStream(filePath);

    const transcription = await this.openAI.audio.transcriptions.create({
      file,
      model: AI_MODEL,
      timestamp_granularities: ['segment'],
      response_format: 'verbose_json',
    });

    return transcription;
  }
}
