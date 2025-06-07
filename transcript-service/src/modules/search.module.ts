import { Logger, Module } from '@nestjs/common';
import { SearchController } from '../controllers/search.controller';
import { SearchService } from 'src/services/search.service';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from 'src/config/app.config';
import { openAIConfig } from 'src/config/open-ai.config';
import { APP_FILTER } from '@nestjs/core';
import {
  S3DalConfig,
  s3DalConfig,
  s3DalConfigKey,
} from 'src/config/s3-dal.config';
import { HttpModule } from '@nestjs/axios';
import { HttpExceptionFilter } from '../filters/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, openAIConfig, s3DalConfig],
    }),
    HttpModule.registerAsync({
      useFactory: (config: S3DalConfig) => {
        return {
          baseURL: config.s3DalUrl,
        };
      },
      inject: [s3DalConfigKey],
    }),
  ],
  controllers: [SearchController],
  providers: [
    SearchService,
    Logger,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class SearchModule {}
