import {
  Inject,
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';
import { KAFKA_CLIENT } from './kafka-client.provider';

@Injectable()
export class ProducerService implements OnModuleInit, OnApplicationShutdown {
  private readonly producer: Producer;

  constructor(@Inject(KAFKA_CLIENT) private readonly kafka: Kafka) {
    this.producer = this.kafka.producer();
  }

  async onModuleInit() {
    await this.producer.connect();
  }

  async produce(record: ProducerRecord) {
    await this.producer.send(record);
  }

  async onApplicationShutdown() {
    await this.producer.disconnect();
  }
}
