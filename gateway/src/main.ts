import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { coursesProxy } from './apiProxies/courses-proxy.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: process.env.CLIENTURL ?? 'http://localhost:5173',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use('/courses-service', coursesProxy);
<<<<<<< Updated upstream
=======
  app.use('/videos-service/:videoId', videosProxy);
>>>>>>> Stashed changes

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
