import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Lecture retriever service')
  .setDescription('service that notifies of lecture upload')
  .setVersion('1.0')
  .build();
