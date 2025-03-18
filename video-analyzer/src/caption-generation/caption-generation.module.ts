import { Module } from '@nestjs/common';
import { CaptionGenerationService } from './caption-generation.service';
import { CaptionGenerationController } from './caption-generation.controller';

@Module({
  controllers: [CaptionGenerationController],
  providers: [CaptionGenerationService],
})
export class CaptionGenerationModule {}
