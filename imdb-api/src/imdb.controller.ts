import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ImDbService } from './imdb.service';

@Controller()
export class ImDbController {
  constructor(private readonly imDbService: ImDbService) {}

  @MessagePattern({ cmd: 'imdb' })
  query(data: string) {
    console.log(data);
    return this.imDbService.axiosGet({
      title: 'Inception',
      releaseDate: 2010,
    });
  }
}
