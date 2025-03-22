import { ConfigType, registerAs } from '@nestjs/config';

export const openAIConfig = registerAs('openAIConfig', () => ({
  apiKey: process.env.OPENAI_API_KEY ?? '',
}));

export type OpenAIConfig = ConfigType<typeof openAIConfig>;
