import { Module } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { ConfigModule } from '@nestjs/config';
import { kafkaConfig } from 'src/config/kafka.config';
import { kafkaClientProvider } from './kafka-client.provider';

@Module({
  imports: [ConfigModule.forFeature(kafkaConfig)],
  providers: [kafkaClientProvider, ConsumerService],
  exports: [ConsumerService],
})
export class KafkaModule {}
