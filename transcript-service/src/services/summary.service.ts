import { Inject, Injectable, Logger } from '@nestjs/common';
import { OPEN_AI_CLIENT } from 'src/constants/open-ai-client-provider';
import OpenAI from 'openai';
import {
  AI_MODEL,
  temperature,
  max_completion_tokens,
  top_p,
  frequency_penalty,
  presence_penalty,
} from 'src/constants/model-params';
import { ChatCompletionMessageParam } from 'openai/resources/chat';
import { getSummaryExpansionPrompt } from 'src/utils/get-summary-prompt-text';

@Injectable()
export class SummaryService {
  constructor(
    @Inject(OPEN_AI_CLIENT) private readonly openAI: OpenAI,
    private readonly logger: Logger,
  ) {}

  async expandSummary(shortSummary: string, topic?: string): Promise<string> {
    try {
      const response = await this.openAI.chat.completions.create({
        model: AI_MODEL,
        messages: this.generateExpandedSummaryPrompt(shortSummary, topic),
        temperature,
        max_completion_tokens,
        top_p,
        frequency_penalty,
        presence_penalty,
      });

      Logger.log({
        message: 'summary expanded successfully',
        summary: response.choices[0].message.content?.trim(),
      });
      
      return response.choices[0].message.content?.trim() || '';
    } catch (error) {
      this.logger.error({ message: 'failed expanding summary', error });
      throw error;
    }
  }

  private generateExpandedSummaryPrompt = (
    shortSummary: string,
    topic?: string,
  ): ChatCompletionMessageParam[] => [
    {
      role: 'system',
      content: [
        {
          type: 'text',
          text: getSummaryExpansionPrompt(),
        },
      ],
    },
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: `Short Summary: ${shortSummary} ${topic ? `Topic:\n${topic}` : ''}`,
        },
      ],
    },
  ];
}
