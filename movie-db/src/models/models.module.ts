import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Actor, ActorSchema } from './schemas/actor.schema';
import { Director, DirectorSchema } from './schemas/director.schema';
import { Genre, GenreSchema } from './schemas/genre.schema';
import { Movie, MovieSchema } from './schemas/movie.schema';
import { User, UserSchema } from './schemas/user.schema';
import { Writer, WriterSchema } from './schemas/writer.schema';

import { ActorService } from './actor/actor.service';
import { DirectorService } from './director/director.service';
import { GenreService } from './genre/genre.service';
import { MovieService } from './movie/movie.service';
import { UserService } from './user/user.service';
import { WriterService } from './writer/writer.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Movie.name, schema: MovieSchema },
      { name: Genre.name, schema: GenreSchema },
      { name: Actor.name, schema: ActorSchema },
      { name: Director.name, schema: DirectorSchema },
      { name: Writer.name, schema: WriterSchema },
    ]),
  ],
  providers: [
    GenreService,
    MovieService,
    ActorService,
    UserService,
    WriterService,
    DirectorService,
  ],
  exports: [
    GenreService,
    MovieService,
    ActorService,
    UserService,
    WriterService,
    DirectorService,
  ],
})
export class ModelsModule {}
