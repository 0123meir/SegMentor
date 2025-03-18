import { Controller, Get } from '@nestjs/common';
import { CaptionGenerationService } from './caption-generation.service';

@Controller('caption-gen')
export class CaptionGenerationController {
  constructor(
    private readonly captionGenerationService: CaptionGenerationService,
  ) {}

  @Get()
  test() {
    return {
      result: this.captionGenerationService.test(),
    };
  }
}
