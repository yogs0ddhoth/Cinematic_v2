import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import {
  ActorInput,
  CreateMovieInput,
  DirectorInput,
  GenreInput,
  WriterInput,
} from 'src/graphql';
import { AppService } from './app.service';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// interface used as arg type for @CurrentUser decorator
import { userAuth } from './auth/dto/user-auth.dto';
import { CurrentUser, GqlJwtAuthGuard } from './auth/jwt-auth.guard';

/**
 * TODO: add documentation
 */
@Resolver('Movie')
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  /**
   * TODO: add documentation
   * @param actors
   * @returns
   */
  @Query('actors')
  async actors(@Args('actors') actors: ActorInput[]) {
    try {
      return await this.appService.getActors({
        actors,
        populate: {
          path: 'movies',
          populate: 'genres directors writers actors',
        },
      });
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  /** TODO: add documentation
   *  @param directors
   *  @returns
   */
  @Query('directors')
  async directors(@Args('directors') directors: DirectorInput[]) {
    try {
      return await this.appService.getDirectors({
        directors,
        populate: {
          path: 'movies',
          populate: 'genres directors writers actors',
        },
      });
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  /**
   * TODO: add documentation
   * @param genres
   * @returns
   */
  @Query('genres')
  async genres(@Args('genres') genres: GenreInput[]) {
    try {
      return await this.appService.getGenres({
        genres,
        populate: {
          path: 'movies',
          populate: 'genres directors writers actors',
        },
      });
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  /**
   * TODO: add documentation
   * @returns
   */
  @Query('movies')
  async movies() {
    try {
      return await this.appService.getMovies({
        populate: 'genres directors writers actors',
      });
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  /**
   * TODO: add documentation
   * @param writers
   * @returns
   */
  @Query('writers')
  async writers(@Args('writers') writers: WriterInput[]) {
    try {
      return await this.appService.getWriters({
        writers,
        populate: {
          path: 'movies',
          populate: 'genres directors writers actors',
        },
      });
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  /**
   * TODO: add documentation
   * @param userAuth
   * @returns
   */
  @Query('userMovies')
  @UseGuards(GqlJwtAuthGuard)
  async userMovies(
    @CurrentUser()
    userAuth: userAuth,
  ) {
    try {
      console.log(userAuth);
      const user = await this.appService.getUser(userAuth);
      return await this.appService.getUserMovies(user);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  /**
   * TODO: add documentation
   * @param userAuth
   * @param movies
   * @returns
   */
  @Mutation('addMovies')
  @UseGuards(GqlJwtAuthGuard)
  async addMovies(
    @CurrentUser() userAuth: userAuth,
    @Args('movies') movies: CreateMovieInput[],
  ) {
    try {
      console.log(userAuth);
      const userID = await this.appService.getUser(userAuth);

      return await this.appService.getUserMovies(
        await this.appService.addMoviesToUser(userID, movies),
      );
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * TODO: add documentation
   * @param userAuth
   * @param id
   * @returns
   */
  @Mutation('removeMovieFromUser')
  @UseGuards(GqlJwtAuthGuard)
  async remove(@CurrentUser() userAuth: userAuth, @Args('id') id: string) {
    try {
      console.log(id);
      const user = await this.appService.removeMoviefromUser(userAuth.id, id);
      console.log(user);
      return user;
    } catch (error) {
      // console.log(error);
      return error;
    }
  }
}
