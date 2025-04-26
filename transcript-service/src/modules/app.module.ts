import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { S3Service } from 'src/services/s3.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [S3Service],
})
export class AppModule {}
