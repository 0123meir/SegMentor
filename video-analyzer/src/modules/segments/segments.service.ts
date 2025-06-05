import { Inject, Injectable, Logger } from '@nestjs/common';

import axios from 'axios';
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

      return JSON.parse(response.choices[0].message.content) as Segment[];
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

  async saveSegments(fileId: string, segments: Segment[]) {
    try {
      for (const segment of segments) {
        await axios.post(
          `${process.env.COURSES_SERVICE_URL}/segments/${fileId}`,
          segment,
        );
      }

      await axios.put(`${process.env.COURSES_SERVICE_URL}/lectures/${fileId}`, {
        status: 'Done',
      });

      this.logger.log(`Segments saved for fileId ${fileId}`);
    } catch (error) {
      this.logger.error({
        message: 'failed updating lecture segments and status',
        fileId,
        error,
      });
    }
  }
}
