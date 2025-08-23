import * as fs from 'fs';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { coursesProxy } from './apiProxies/courses-proxy.middleware';
import { videosProxy } from './apiProxies/videos-proxy.middleware';
import { transcriptProxy } from './apiProxies/transcript-proxy-middleware';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('/app/ssl/myserver.key'),
    cert: fs.readFileSync('/app/ssl/CSB.crt'),
  };
  const app = await NestFactory.create(AppModule, { httpsOptions });
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: process.env.CLIENTURL ?? 'https://localhost',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use('/courses-service', coursesProxy);
  app.use('/transcript-service', transcriptProxy);
  app.use('/videos-service/:videoId', videosProxy);
  app.use('/transcript-service', transcriptProxy);

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
