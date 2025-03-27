import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Video Analyzer')
  .setDescription('Service that processes video and generates segments')
  .setVersion('1.0')
  .build();
