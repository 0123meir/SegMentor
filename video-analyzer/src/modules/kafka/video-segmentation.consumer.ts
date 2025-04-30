import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import axios from 'axios';
import { AppService } from 'src/app.service';

@Injectable()
export class VideoSegmentationConsumer implements OnModuleInit {
  constructor(
    private readonly consumerService: ConsumerService,
    private readonly logger: Logger,
    private readonly appService: AppService,
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
            );

            const mp3Buffer = Buffer.from(response.data, 'utf-8');
            this.logger.log(`Downloaded MP3 for fileId ${fileId}`);
            // need to separate to segments and send it to the client
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
