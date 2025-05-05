import { registerAs } from '@nestjs/config';

export interface KafkaConfig {
  brokers: string[];
}

export const kafkaConfig = registerAs('kafka', (): KafkaConfig => ({
  brokers: [process.env.KAFKA_URL ?? 'localhost:9092'],
}));
