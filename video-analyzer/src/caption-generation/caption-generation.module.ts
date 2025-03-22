import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OpenAIModule } from 'src/open-ai/open-ai.module';
import { CaptionGenerationController } from './caption-generation.controller';
import { CaptionGenerationService } from './caption-generation.service';

@Module({
  imports: [ConfigModule, OpenAIModule],
  controllers: [CaptionGenerationController],
  providers: [CaptionGenerationService],
})
export class CaptionGenerationModule {}
