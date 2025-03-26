import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { APP_CONFIG_KEY } from './config/app.config';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  const port = app.get(ConfigService).get(`${APP_CONFIG_KEY}.port`);
  const logger = app.get(Logger);

  await app.listen(port, () => {
    logger.log(`App listening to port ${port}`);
  });
}
bootstrap();
