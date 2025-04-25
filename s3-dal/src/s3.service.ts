import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { unlink } from 'fs/promises';
import { extname } from 'path';
import { noop } from 'rxjs';
import { Readable } from 'stream';
import { S3Repository } from './s3.repository';
import { UploadFileRequestDTO } from './types/dto/upload-file-request.dto';
import { S3Bucket } from './types/s3-bucket.enum';
import { createReadStream } from 'fs';
import { FileUploadStrategy } from './types/file-upload-strategy.enum';
import { FileType } from './types/file.type';

@Injectable()
export class S3Service {
  constructor(private readonly s3Repository: S3Repository) {}

  async uploadFile(
    file: Express.Multer.File,
    fileId: UploadFileRequestDTO['fileId'],
    fileUploadStrategy: FileUploadStrategy,
    bucket: S3Bucket,
  ) {
    try {
      const fileName = `${fileId}${extname(file.originalname)}`;

      const fileContent =
        fileUploadStrategy === FileUploadStrategy.IN_MEMORY
          ? file.buffer
          : createReadStream(file.path);

      const result = await this.s3Repository.putObject(
        bucket,
        fileName,
        fileContent,
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
  ): Promise<string> {
    try {
      const fileKey = `${fileId}${fileType.extension}`;
      const file = await this.s3Repository.getObject(bucket, fileKey);

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
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'File retrieval failure',
        error: error.message,
        fileId,
      });
    }
  }
}
