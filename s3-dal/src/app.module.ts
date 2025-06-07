import { Logger, Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { S3Controller } from './s3.controller';
import { ConfigModule } from '@nestjs/config';
import { s3Config } from './config/s3-config';
import { s3ClientProvider } from './s3-client.provider';
import { appConfig } from './config/app.config';
import { S3Repository } from './s3.repository';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, s3Config],
    }),
  ],
  providers: [
    s3ClientProvider,
    S3Service,
    S3Repository,
    Logger,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
  controllers: [S3Controller],
})
export class AppModule {}
