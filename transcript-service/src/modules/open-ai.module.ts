import { Module } from '@nestjs/common';
import { openAIClientProvider } from '../providers/open-ai-client.provider';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [openAIClientProvider],
  exports: [openAIClientProvider],
})
export class OpenAIModule {}
