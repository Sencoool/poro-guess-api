import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getGawston(): string {
    return 'Hello Gawston!'
  }
}
