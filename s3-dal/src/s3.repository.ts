import {
  GetObjectCommand,
  GetObjectCommandOutput,
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { Inject, Injectable } from '@nestjs/common';
import { S3_CLIENT_TOKEN } from './constants/s3-client-token';
import { S3Bucket } from './types/s3-bucket.enum';
import { ReadStream } from 'fs';

@Injectable()
export class S3Repository {
  constructor(@Inject(S3_CLIENT_TOKEN) private readonly s3Client: S3Client) {}

  async putObject(
    bucket: S3Bucket,
    key: string,
    fileContent: Buffer | Uint8Array | Blob | string | ReadStream,
  ): Promise<PutObjectCommandOutput> {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: fileContent,
    });

    return this.s3Client.send(command);
  }

  async getObject(
    bucket: S3Bucket,
    key: string,
  ): Promise<GetObjectCommandOutput> {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    return this.s3Client.send(command);
  }
}
