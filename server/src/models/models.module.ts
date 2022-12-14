import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Genre, GenreSchema } from './schemas/genre.schema';
import { Movie, MovieSchema } from './schemas/movie.schema';
import { Star, StarSchema } from './schemas/star.schema';
import { User, UserSchema } from './schemas/user.schema';

import { GenreService } from './genre/genre.service';
import { MovieService } from './movie/movie.service';
import { StarService } from './star/star.service';
import { UserService } from './user/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Movie.name, schema: MovieSchema },
      { name: Genre.name, schema: GenreSchema },
      { name: Star.name, schema: StarSchema },
    ]),
  ],
  providers: [GenreService, MovieService, StarService, UserService],
  exports: [GenreService, MovieService, StarService, UserService],
})
export class ModelsModule {}
