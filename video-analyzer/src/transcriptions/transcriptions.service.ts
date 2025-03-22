import { Inject, Injectable, Logger } from '@nestjs/common';
import fs from 'fs';
import OpenAI from 'openai';
import path from 'path';
import { OPEN_AI_CLIENT } from 'src/open-ai/constants';
import { AI_MODEL, RESPONSE_FORMAT } from './constants';

@Injectable()
export class TranscriptionsService {
  constructor(
    @Inject(OPEN_AI_CLIENT) private readonly openAI: OpenAI,
    private readonly logger: Logger,
  ) {}

  async transcribe(mp3FilePath: string) {
    try {
      this.logger.log('transcribing');

      const file = fs.createReadStream(path.join(__dirname, mp3FilePath));

      const transcription = await this.openAI.audio.transcriptions.create({
        file,
        model: AI_MODEL,
        response_format: RESPONSE_FORMAT,
      });

      this.logger.log('finished transcribing successfully');

      return transcription;
    } catch (error) {
      this.logger.error('error transcribing', error);
      console.log(error);
    }
  }
}
