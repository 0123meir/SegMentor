import { ConfigType, registerAs } from '@nestjs/config';

export const s3DalConfig = registerAs('s3DalConfig', () => ({
  s3DalUrl: process.env.S3_DAL_URL ?? 'http://localhost:3000',
}));

export const s3DalConfigKey = s3DalConfig.KEY;
export type S3DalConfig = ConfigType<typeof s3DalConfig>;
