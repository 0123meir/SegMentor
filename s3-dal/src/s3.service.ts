import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createReadStream } from 'fs';
import { unlink } from 'fs/promises';
import { noop } from 'rxjs';
import { Readable } from 'stream';
import { S3Repository } from './s3.repository';
import { FileUploadStrategy } from './types/file-upload-strategy.enum';
import { FileType } from './types/file.type';
import { S3Bucket } from './types/s3-bucket.enum';

@Injectable()
export class S3Service {
  constructor(private readonly s3Repository: S3Repository) {}

  async uploadFile(
    file: Express.Multer.File,
    fileUploadStrategy: FileUploadStrategy,
    bucket: S3Bucket,
  ) {
    try {
      const fileContent =
        fileUploadStrategy === FileUploadStrategy.IN_MEMORY
          ? file.buffer
          : createReadStream(file.path);

      const result = await this.s3Repository.putObject(
        bucket,
        file.originalname,
        fileContent,
        file.mimetype,
      );

      return result.$metadata;
    } catch (error) {
      console.error(error);

      throw new InternalServerErrorException('File upload failed');
    } finally {
      unlink(file.path).catch(noop);
    }
  }

  async getFile(
    bucket: S3Bucket,
    fileId: string,
    fileType: FileType,
  ): Promise<Buffer> {
    try {
      const fileKey = `${fileId}${fileType.extension}`;
      const file = await this.s3Repository.getObject(bucket, fileKey);

      if (file.Body instanceof Readable) {
        const streamToBuffer = (stream: Readable): Promise<Buffer> => {
          return new Promise((resolve, reject) => {
            const chunks: Buffer[] = [];
            stream.on('data', (chunk) => chunks.push(chunk));
            stream.on('end', () => resolve(Buffer.concat(chunks)));
            stream.on('error', reject);
          });
        };

        return await streamToBuffer(file.Body);
      }

      if (Buffer.isBuffer(file.Body)) {
        return file.Body;
      }

      throw new Error('Unknown file body type');
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'File retrieval failure',
        error: error.message,
        fileId,
      });
    }
  }
}
