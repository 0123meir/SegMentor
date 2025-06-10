import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from 'src/config/app.config';
import { openAIConfig } from 'src/config/open-ai.config';
import {
  s3DalConfig,
  S3DalConfig,
  s3DalConfigKey,
} from 'src/config/s3-dal.config';
import { OpenAIModule } from './open-ai.module';
import { ChatController } from 'src/controllers/chat.controller';
import { ChatService } from 'src/services/chat.service';

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
    OpenAIModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, Logger],
})
export class ChatModule {}
