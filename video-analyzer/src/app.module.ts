import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SegmentsService } from './segments/segments.service';
import { CaptionGenerationModule } from './caption-generation/caption-generation.module';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [appConfig] }),
    CaptionGenerationModule,
  ],
  controllers: [AppController],
  providers: [AppService, SegmentsService, Logger],
})
export class AppModule {}
