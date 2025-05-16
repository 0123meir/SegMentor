import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Video Initiazlizer')
  .setDescription('Service that extracts the mp3 from mp4')
  .setVersion('1.0')
  .build();
