import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Genre, GenreSchema } from './schemas/genre.schema';
import { Movie, MovieSchema } from './schemas/movie.schema';
import { Actor, ActorSchema } from './schemas/actor.schema';
import { User, UserSchema } from './schemas/user.schema';

import { GenreService } from './genre/genre.service';
import { MovieService } from './movie/movie.service';
import { ActorService } from './actor/actor.service';
import { UserService } from './user/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Movie.name, schema: MovieSchema },
      { name: Genre.name, schema: GenreSchema },
      { name: Actor.name, schema: ActorSchema },
    ]),
  ],
  providers: [GenreService, MovieService, ActorService, UserService],
  exports: [GenreService, MovieService, ActorService, UserService],
})
export class ModelsModule {}
