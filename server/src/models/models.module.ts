import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { GenreService } from './genre/genre.service';
import { MovieService } from './movie/movie.service';
import { StarService } from './star/star.service';
import { UserService } from './user/user.service';

@Module({
  providers: [PrismaService],
  exports: [GenreService, MovieService, StarService, UserService],
})
export class ModelsModule {}
