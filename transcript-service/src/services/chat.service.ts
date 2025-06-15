import { Inject, Injectable, Logger } from '@nestjs/common';
import { OpenAI } from 'openai';
import {
  AI_MODEL,
  frequency_penalty,
  max_completion_tokens,
  presence_penalty,
  temperature,
  top_p,
} from 'src/constants/model-params';
import { OPEN_AI_CLIENT } from 'src/constants/open-ai-client-provider';
import { getChatPrompt } from 'src/utils/chat-prompt-text';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ChatService {
  private cachedTranscriptId: string | null = null;
  private cachedTranscriptText: string | null = null;

  constructor(
    @Inject(OPEN_AI_CLIENT) private readonly openAI: OpenAI,
    private readonly s3DalHttpService: HttpService,
    private readonly logger: Logger,
  ) {}

  async chat(
    transcriptId: string,
    history: { role: 'user' | 'assistant'; content: string }[],
    message: string,
  ) {
    try {
      const transcriptText = await this.getTranscript(transcriptId);

      const messages: Array<{
        role: 'system' | 'user' | 'assistant';
        content: string;
      }> = [
        { role: 'system', content: getChatPrompt(transcriptText).trim() },
        ...history,
        { role: 'user', content: message },
      ];

      const completion = await this.openAI.chat.completions.create({
        model: AI_MODEL,
        messages,
        temperature,
        max_completion_tokens,
        top_p,
        frequency_penalty,
        presence_penalty,
      });

      this.logger.log({
        message: 'chat completed successfully',
        summary: completion.choices[0].message.content?.trim(),
      });

      return {
        role: 'assistant',
        answer: completion.choices[0].message.content?.trim() || '',
      };
    } catch (error) {
      this.logger.error({ message: 'Chat processing error', error });
      throw new Error('Chat processing error');
    }
  }

  private async getTranscript(transcriptId: string): Promise<string> {
    if (this.cachedTranscriptId === transcriptId && this.cachedTranscriptText) {
      return this.cachedTranscriptText;
    }

    try {
      this.cachedTranscriptText = await this.fetchTranscript(transcriptId);
      this.cachedTranscriptId = transcriptId;
      return this.cachedTranscriptText;
    } catch (error) {
      this.logger.error({
        message: 'Error fetching transcript',
        transcriptId,
        error,
      });
      throw new Error('Error fetching transcript');
    }
  }

  private async fetchTranscript(transcriptId: string): Promise<string> {
    try {
      const { data: fileContent } = await firstValueFrom(
        this.s3DalHttpService.get<string>(`/srt/${transcriptId}`),
      );

      this.logger.log({
        message: 'received transcript successfully',
        transcriptId,
      });

      return fileContent as string;
    } catch (err) {
      this.logger.error({
        message: 'error on receiving transcript',
        transcriptId,
      });
      throw new Error('Transcript not found');
    }
  }
}
