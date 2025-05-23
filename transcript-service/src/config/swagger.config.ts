import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Transcript Service')
  .setDescription(
    'Service that allows for user actions on transcribed lectures',
  )
  .setVersion('1.0')
  .build();
