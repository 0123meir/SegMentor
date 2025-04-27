import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_CONFIG_KEY } from './config/app.config';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  const port = app.get(ConfigService).get(`${APP_CONFIG_KEY}.port`);
  const logger = app.get(Logger);

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(port, () => {
    logger.log(`App listening to port ${port}`);
  });
}
bootstrap();
