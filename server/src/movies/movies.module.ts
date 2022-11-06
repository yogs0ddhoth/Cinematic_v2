import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesResolver } from './movies.resolver';
import { PrismaService } from './prisma/prisma.service';

@Module({
  providers: [
    MoviesResolver, 
    MoviesService, 
    // PrismaService
  ],
})
export class MoviesModule {}
