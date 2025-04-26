import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('S3 DAL')
  .setDescription('Segmentor service that handles file upload and retrieval')
  .setVersion('1.0')
  .build();
