import { ConfigType, registerAs } from '@nestjs/config';

export const httpConfig = registerAs('httpConfig', () => ({
  coursesServiceUrl: process.env.COURSES_SERVICE_URL ?? 'http://localhost:3002',
}));

export type HttpConfig = ConfigType<typeof httpConfig>;
