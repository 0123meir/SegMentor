import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ChatService } from 'src/services/chat.service';

@Controller()
export class ChatController {
  constructor(private readonly aiService: ChatService) {}

  @Post('chat')
  async chat(
    @Body()
    body: {
      transcriptId: string;
      history: { role: 'user' | 'assistant'; content: string }[];
      message: string;
    },
  ) {
    try {
      return this.aiService.chat(body.transcriptId, body.history, body.message);
    } catch (error) {
      throw new HttpException(
        'Failed to return chat response',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
