import { Inject, Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { OPEN_AI_CLIENT } from 'src/open-ai/constants';

@Injectable()
export class CaptionGenerationService {
  constructor(@Inject(OPEN_AI_CLIENT) private readonly openAI: OpenAI) {}

  test() {
    return 'hi';
  }
}
