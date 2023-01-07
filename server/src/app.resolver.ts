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

// interface used as arg type for @CurrentUser decorator
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { userAuth } from './auth/dto/user-auth.dto';
import { CurrentUser, GqlJwtAuthGuard } from './auth/jwt-auth.guard';

/**
 * CLass containing resolvers for the movieDB subgraph
 */
@Resolver('AppResolver')
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  /**
   * Query for actors by name, and return, with their referenced movies populated
   * @param actors ActorInput[] - an array of actors to search for
   * @type {ActorInput} {name: string}
   * @returns Actor[] - an array of actors, with their movies, and references populated
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

  /** Query for directors by name, and return, with their referenced movies populated
   *  @param directors DirectorInput[] - an array of directors to search for
   *  @type {DirectorInput} {name: string}
   *  @returns Director[] - an array of directors, with their movies, and references populated
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
   * Query for genres by name, and return, with their referenced movies populated
   * @param genres GenreInput[] - an array of genres to search for
   * @type {GenreInput} {name: string}
   * @returns Genre[] - an array of genres, with their movies, and references populated
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
   * Get all movies, and populate their references
   * @returns Movie[] - an array of movies, with their references populated
   */
  @Query('movies')
  async movies() {
    try {
      return await this.appService.getMovies({
        populate: 'genres directors writers actors trailers',
      });
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  /**
   * Query for writers by name, and return, with their referenced movies populated
   * @param writers WriterInput[] - an array of writers to search for
   * @type {WriterInput} {name: string}
   * @returns Writer[] - an array of writers, with their movies, and references populated
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
   * Query single User by Auth, and return, with their referenced movies populated
   * @param userAuth userAuth - the userAuth object containing the user's id and username
   * @type {userAuth} {id: string}
   * @returns User - a user, with their movies, and references populated
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
   * Add movies, with references, to a user's list, creating those that don't exist
   * @param userAuth userAuth - the userAuth object containing the user's id and username
   * @param movies createMovieInput[] - an array of movies to add to the user's list
   * @returns User - a user, with their movies, and references populated
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
   * Remove a movie from a user's list
   * @param userAuth userAuth - the userAuth object containing the user's id and username
   * @param id string - the id of the movie to remove
   * @returns User - updated user, with their movies, and references populated
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
