import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './config/app.config';
import { AppController } from './app.controller';
import { LecturesModule } from './modules/lectures/lectures.module';
import { httpConfig } from './config/http.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, httpConfig],
    }),
    LecturesModule,
  ],
  providers: [Logger],
  controllers: [AppController],
})
export class AppModule {}
