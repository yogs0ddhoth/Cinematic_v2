import { Module } from '@nestjs/common';
import { ImDbController } from './imdb.controller';
import { ImDbService } from './imdb.service';

@Module({
  imports: [],
  controllers: [ImDbController],
  providers: [ImDbService],
})
export class ImDbModule {}
