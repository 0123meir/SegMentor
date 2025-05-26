import { registerAs } from '@nestjs/config';

export const APP_CONFIG_KEY = 'appConfig';

export const appConfig = registerAs(APP_CONFIG_KEY, () => ({
  port: process.env.PORT ?? 3004,
}));
