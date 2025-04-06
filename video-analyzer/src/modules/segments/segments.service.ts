import { Inject, Injectable, Logger } from '@nestjs/common';

import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { OPEN_AI_CLIENT } from '../open-ai/constants';
import { TranscriptionData } from '../transcriptions/types/transcription-data.type';
import {
  AI_MODEL,
  frequency_penalty,
  max_completion_tokens,
  presence_penalty,
  temperature,
  top_p,
} from './constants/model-params';
import { segmentsSchema } from './constants/segments-schema';
import { Segment } from './types/segment';
import { getSystemPromptText } from './utils/get-system-prompt-text';

@Injectable()
export class SegmentsService {
  constructor(
    @Inject(OPEN_AI_CLIENT) private readonly openAI: OpenAI,
    private readonly logger: Logger,
  ) {}

  createSegmentsFromTranscription = async (
    fileId: string,
    transcriptionData: TranscriptionData,
  ): Promise<Segment[]> => {
    try {
      this.logger.log({ message: 'creating segments', fileId });

      const response = await this.openAI.chat.completions.create({
        model: AI_MODEL,
        messages: this.generateSegmentsPrompt(transcriptionData),
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

      return JSON.parse(response.choices[0].message.content) as Segment[]; //TODO: save to db when ready
    } catch (error) {
      this.logger.error({ message: 'failed creating segments', fileId, error });

      throw error;
    }
  };

  private generateSegmentsPrompt = ({
    transcription,
    language,
  }: TranscriptionData): ChatCompletionMessageParam[] => [
    {
      role: 'system',
      content: [
        {
          type: 'text',
          text: getSystemPromptText(language),
        },
      ],
    },
    { role: 'user', content: [{ type: 'text', text: transcription }] },
  ];
}
