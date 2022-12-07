import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesResolver } from './movies.resolver';
import { PrismaService } from './prisma/prisma.service';
import StarsService from './stars.service';
import GenresService from './genres.service';
import UsersService from './users.service';

@Module({
  providers: [
    GenresService,
    MoviesResolver,
    MoviesService,
    PrismaService,
    StarsService,
    UsersService,
  ],
})
export class MoviesModule {}
