import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  // Enable CORS
  app.enableCors();

  const port = process.env.PORT || 3000;

  const logger = app.get(Logger);

  await app.listen(port, () => {
    logger.log(`App listening to port ${port}`);
  });
}
bootstrap();
