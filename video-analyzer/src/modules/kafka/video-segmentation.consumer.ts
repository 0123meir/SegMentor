import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import axios from 'axios';
import { AppService } from 'src/app.service';
import { SegmentsService } from '../segments/segments.service';
import { FILE_UPLOAD_DIRECTORY } from '../../constants/file-upload-directory';
import { join } from 'path';
import { writeFile } from 'fs/promises';
import { S3DalConfig, s3DalConfigKey } from 'src/config/s3-dal.config';

@Injectable()
export class VideoSegmentationConsumer implements OnModuleInit {
  constructor(
    private readonly consumerService: ConsumerService,
    private readonly logger: Logger,
    private readonly appService: AppService,
    private readonly segmentService: SegmentsService,
    @Inject(s3DalConfigKey) private readonly s3Config: S3DalConfig,
  ) {}

  async onModuleInit() {
    await this.consumerService.consume(
      {
        topics: [
          process.env.KAFKA_VIDEO_TO_SEGMENTS_TOPIC ?? 'video-to-segment',
        ],
      },
      {
        eachBatch: async ({
          batch,
          resolveOffset,
          heartbeat,
          isRunning,
          isStale,
          commitOffsetsIfNecessary,
        }) => {
          for (const message of batch.messages) {
            if (!isRunning() || isStale()) break;

            const { fileId } = JSON.parse(message.value.toString());
            this.logger.log(`Received fileId: ${fileId}`);

            const heartbeatInterval = setInterval(() => {
              heartbeat().catch((err) =>
                this.logger.warn(
                  `Heartbeat failed during processing: ${err.message}`,
                ),
              );
            }, 5000);

            try {
              const response = await axios.get(
                `${this.s3Config.s3DalUrl}/audio/${fileId}`,
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

              await this.segmentService.saveSegments(
                fileId,
                segments['segments'],
              );

              resolveOffset(message.offset);
              await commitOffsetsIfNecessary();
            } catch (error) {
              this.logger.error(
                `Error processing fileId ${fileId}: ${error.message}`,
              );
            } finally {
              clearInterval(heartbeatInterval);
              await heartbeat();
            }
          }
        },
      },
    );
  }
}
