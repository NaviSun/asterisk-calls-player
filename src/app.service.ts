import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(user): string {
    console.log(user);
    return 'Hello World!';
  }
}
