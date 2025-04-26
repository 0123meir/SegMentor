import { S3Client } from '@aws-sdk/client-s3';
import { FactoryProvider } from '@nestjs/common';
import { S3_CLIENT_TOKEN } from './constants/s3-client-token';
import { s3Config, S3Config } from './config/s3-config';

export const s3ClientProvider: FactoryProvider<S3Client> = {
  provide: S3_CLIENT_TOKEN,
  useFactory: (s3Config: S3Config): S3Client =>
    new S3Client({
      region: s3Config.region,
      credentials: {
        accessKeyId: s3Config.accessKeyId,
        secretAccessKey: s3Config.secretAccessKey,
      },
    }),
  inject: [s3Config.KEY],
};
