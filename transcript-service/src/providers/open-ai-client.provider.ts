import { FactoryProvider } from '@nestjs/common';
import OpenAI from 'openai';
import { openAIConfig, OpenAIConfig } from '../config/open-ai.config';
import { OPEN_AI_CLIENT } from '../constants/open-ai-client-provider';

export const openAIClientProvider: FactoryProvider<OpenAI> = {
  provide: OPEN_AI_CLIENT,
  useFactory: (openAIConfig: OpenAIConfig): OpenAI =>
    new OpenAI({
      apiKey: openAIConfig.apiKey,
      timeout: openAIConfig.timeout,
    }),
  inject: [openAIConfig.KEY],
};
