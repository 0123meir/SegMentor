import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CaptionGenerationModule } from './caption-generation/caption-generation.module';
import { appConfig } from './config/app.config';
import { SegmentsModule } from './segments/segments.module';
import { openAIConfig } from './config/open-ai.config';
import { OpenAIModule } from './open-ai/open-ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, openAIConfig],
    }),
    CaptionGenerationModule,
    SegmentsModule,
    OpenAIModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
