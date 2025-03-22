import { Inject, Injectable } from '@nestjs/common';

import * as fs from 'fs';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';
import { OPEN_AI_CLIENT } from 'src/open-ai/constants';
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

@Injectable()
export class SegmentsService {
  constructor(@Inject(OPEN_AI_CLIENT) private readonly openAI: OpenAI) {}

  createSegmentsFromSRT = async (srtFilePath: string): Promise<JSON> => {
    try {
      const srt = fs.readFileSync(srtFilePath, 'utf8');

      const response = await this.openAI.chat.completions.create({
        model: AI_MODEL,
        messages: this.generateSegmentsPrompt(srt),
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

      return JSON.parse(response.choices[0].message.content); //TODO: save to db when ready
    } catch (error) {
      console.error(error);
    }
  };

  private generateSegmentsPrompt = (
    srt: string,
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
    { role: 'user', content: [{ type: 'text', text: srt }] },
  ];
}
