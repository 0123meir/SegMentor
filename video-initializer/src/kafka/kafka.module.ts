import { Module } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { kafkaConfig } from '../config/kafka.config';
import { ConfigModule } from '@nestjs/config';
import { kafkaClientProvider } from './kafka-client.provider';

@Module({
  imports: [ConfigModule.forFeature(kafkaConfig)],
  providers: [kafkaClientProvider, ProducerService],
  exports: [ProducerService],
})
export class KafkaModule {}
