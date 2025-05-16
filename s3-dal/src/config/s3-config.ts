import { ConfigType, registerAs } from '@nestjs/config';

export const s3Config = registerAs('s3Config', () => ({
  region: 'eu-north-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? 'aws-local',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? 'aws-local',
}));

export type S3Config = ConfigType<typeof s3Config>;
