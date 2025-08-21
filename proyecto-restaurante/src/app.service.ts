import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  // constructor(private configService: ConfigService) {}

  getHello(): string {
    return 'Hello World!';
  }

  // getMessage(): string {
  //   return this.configService.get('MESSAGE')?? 'mensaje por defecto';
  // }
}
