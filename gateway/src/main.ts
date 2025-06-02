import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { coursesProxy } from './apiProxies/courses-proxy.middleware';
import { videosProxy } from './apiProxies/videos-proxy.middleware';
import { transcriptProxy } from './apiProxies/transcripts-proxy.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: process.env.CLIENTURL ?? 'http://localhost:5174',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use('/courses-service', coursesProxy);
  app.use('/videos-service/:videoId', videosProxy);
  app.use('/transcript-service', transcriptProxy);

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
