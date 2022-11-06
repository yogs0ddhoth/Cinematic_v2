import { Injectable } from '@nestjs/common';

@Injectable()
export class ImDbService {
  getHello(): string {
    return 'Itz Johhn';
  }
}
