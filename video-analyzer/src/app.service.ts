import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor() {}
  async sayHello() {
    return 'hello';
  }
}
