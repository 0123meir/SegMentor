import { ConfigType, registerAs } from '@nestjs/config';

export const openAIConfig = registerAs('openAIConfig', () => ({
  apiKey: process.env.OPENAI_API_KEY ?? '',
  timeout: Number(process.env.OPENAI_TIMEOUT ?? 180_000),
}));

export type OpenAIConfig = ConfigType<typeof openAIConfig>;
