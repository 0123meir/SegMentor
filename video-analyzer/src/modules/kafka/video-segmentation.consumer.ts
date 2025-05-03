import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import axios from 'axios';
import { AppService } from 'src/app.service';
import { SegmentsService } from '../segments/segments.service';
import { FILE_UPLOAD_DIRECTORY } from '../../constants/file-upload-directory';
import { join } from 'path';
import { writeFile } from 'fs/promises';

@Injectable()
export class VideoSegmentationConsumer implements OnModuleInit {
  constructor(
    private readonly consumerService: ConsumerService,
    private readonly logger: Logger,
    private readonly appService: AppService,
    private readonly segmentService: SegmentsService,
  ) {}

  async onModuleInit() {
    await this.consumerService.consume(
      { topics: ['video.to-segment'] },
      {
        eachMessage: async ({ message }) => {
          const { fileId } = JSON.parse(message.value.toString());
          this.logger.log(`Received fileId: ${fileId}`);

          try {
            const response = await axios.get(
              `${process.env.UPLOAD_FILE_S3_URL}/audio/${fileId}`,
              { responseType: 'arraybuffer' },
            );

            const mp3Buffer = Buffer.from(response.data);
            this.logger.log(`Downloaded MP3 for fileId ${fileId}`);

            const filePath = join(FILE_UPLOAD_DIRECTORY, `${fileId}.mp3`);
            await writeFile(filePath, mp3Buffer);

            const mp3BufferFile: Express.Multer.File = {
              fieldname: 'file',
              originalname: `${fileId}.mp3`,
              encoding: '7bit',
              mimetype: 'audio/mpeg',
              size: mp3Buffer.length,
              buffer: mp3Buffer,
              destination: FILE_UPLOAD_DIRECTORY,
              filename: `${fileId}.mp3`,
              path: filePath,
              stream: null,
            };

            const segments = await this.appService.getSegments(
              fileId,
              mp3BufferFile,
            );
            
            await this.segmentService.saveSegments(fileId, segments["segments"]);
            this.logger.log(`Segments saved in database for fileId ${fileId}`);
          } catch (error) {
            this.logger.error(
              `Failed to fetch MP3 for fileId ${fileId}: ${error.message}`,
            );
          }
        },
      },
    );
  }
}
