import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices/client';

@Injectable()
export class AppService {
  constructor(
    @Inject('IMDB_API') private readonly client: ClientProxy
  ) {}
  getHello(): string {
    return 'Hello World!';
  }
  queryAPI() {
    return this.client.send({cmd: 'imdb'}, 'Hiya Chuck');
  }
}