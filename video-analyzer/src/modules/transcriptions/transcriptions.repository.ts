import { Inject, Injectable, Logger } from '@nestjs/common';
import { OPEN_AI_CLIENT } from '../open-ai/constants';
import OpenAI from 'openai';
import fs from 'fs';
import { AI_MODEL } from './constants';

@Injectable()
export class TranscriptionsRepository {
  constructor(@Inject(OPEN_AI_CLIENT) private readonly openAI: OpenAI) {}

  async generateTranscriptionSRT(filePath: string) {
    const file = fs.createReadStream(filePath);

    const transcription = await this.openAI.audio.transcriptions.create({
      file,
      model: AI_MODEL,
      response_format: 'srt',
    });

    return transcription;
  }

  async generateTranscriptionJSON(filePath: string) {
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
