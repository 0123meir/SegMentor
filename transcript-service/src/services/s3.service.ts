import { Injectable } from '@nestjs/common';
import {
  S3Client,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';

@Injectable()
export class S3Service {
  private s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      region: 'eu-north-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
      },
    });
  }

  async getFile(bucketName: string, key: string): Promise<string | undefined> {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    const file = await this.s3.send(command);

    if (file.Body instanceof Readable) {
      // Use a Promise to manage the async collection of stream data
      const streamToBuffer = (stream: Readable): Promise<Buffer> => {
        return new Promise((resolve, reject) => {
          const chunks: Buffer[] = [];
          stream.on('data', (chunk) => chunks.push(chunk));
          stream.on('end', () => resolve(Buffer.concat(chunks)));
          stream.on('error', reject);
        });
      };

      return (await streamToBuffer(file.Body)).toString('utf-8');
    }
  }
}
