import { FactoryProvider } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { kafkaConfig, KafkaConfig } from '../../config/kafka.config';
import { KAFKA_CLIENT } from 'src/constants/kafka-client-provider';

export const kafkaClientProvider: FactoryProvider<Kafka> = {
  provide: KAFKA_CLIENT,
  useFactory: (config: KafkaConfig) => {
    return new Kafka({
      brokers: config.brokers,
    });
  },
  inject: [kafkaConfig.KEY],
};
export { KAFKA_CLIENT };

