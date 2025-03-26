import { Inject, Injectable, Logger } from '@nestjs/common';

import * as fs from 'fs';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';
import {
  AI_MODEL,
  frequency_penalty,
  max_completion_tokens,
  presence_penalty,
  temperature,
  top_p,
} from './constants/model-params';
import { segmentsSchema } from './constants/segments-schema';
import { promptText } from './constants/model-prompt-text';
import { OPEN_AI_CLIENT } from '../open-ai/constants';

@Injectable()
export class SegmentsService {
  constructor(
    @Inject(OPEN_AI_CLIENT) private readonly openAI: OpenAI,
    private readonly logger: Logger,
  ) {}

  createSegmentsFromTranscription = async (
    fileId: string,
    transcription: string,
  ): Promise<JSON> => {
    try {
      this.logger.log({ message: 'creating segments', fileId });

      const response = await this.openAI.chat.completions.create({
        model: AI_MODEL,
        messages: this.generateSegmentsPrompt(transcription),
        response_format: {
          type: 'json_schema',
          json_schema: segmentsSchema,
        },
        temperature,
        max_completion_tokens,
        top_p,
        frequency_penalty,
        presence_penalty,
      });

      this.logger.log({ message: 'finished segmenting successfully', fileId });

      return JSON.parse(response.choices[0].message.content); //TODO: save to db when ready
    } catch (error) {
      this.logger.error({ message: 'failed creating segments', fileId });

      throw error;
    }
  };

  private generateSegmentsPrompt = (
    transcription: string,
  ): ChatCompletionMessageParam[] => [
    {
      role: 'system',
      content: [
        {
          type: 'text',
          text: promptText,
        },
      ],
    },
    { role: 'user', content: [{ type: 'text', text: transcription }] },
  ];
}
