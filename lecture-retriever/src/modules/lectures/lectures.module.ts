import { Module } from '@nestjs/common';
import { LecturesController } from './lectures.controller';
import { LecturesService } from './lectures.service';
import { LecturesRepository } from './lectures.repository';
import { httpConfig, HttpConfig } from 'src/config/http.config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: (config: HttpConfig) => {
        return {
          baseURL: config.coursesServiceUrl,
        };
      },
      inject: [httpConfig.KEY],
    }),
  ],
  controllers: [LecturesController],
  providers: [LecturesService, LecturesRepository],
})
export class LecturesModule {}
