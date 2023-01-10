import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import {
  ActorInput,
  CreateMovieInput,
  DirectorInput,
  GenreInput,
  WriterInput,
} from 'src/graphql';
import { MovieDbService } from './movie-db.service';

// interface used as arg type for @CurrentUser decorator
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { userAuth } from './auth/dto/user-auth.dto';
import { CurrentUser, GqlJwtAuthGuard } from './auth/jwt-auth.guard';

/**
 * CLass containing resolvers for the movieDB subgraph
 */
@Resolver()
export class MovieDbResolver {
  constructor(private readonly movieDbService: MovieDbService) {}

  /**
   * Query for actors by name, and return, with their referenced movies populated
   * @param actors ActorInput[] - an array of actors to search for
   * @type {ActorInput} {name: string}
   * @returns gql'[Actor!]' - an array of actors, with their movies, and references populated
   */
  @Query('actors')
  async actors(@Args('actors') actors: ActorInput[]) {
    try {
      return await this.movieDbService.getActors({
        actors,
        populate: {
          path: 'movies',
          populate: 'genres director writers actors',
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  /** Query for directors by name, and return, with their referenced movies populated
   *  @param directors DirectorInput[] - an array of directors to search for
   *  @type {DirectorInput} {name: string}
   *  @returns gql'[Director!]' - an array of directors, with their movies, and references populated
   */
  @Query('directors')
  async directors(@Args('directors') directors: DirectorInput[]) {
    try {
      return await this.movieDbService.getDirectors({
        directors,
        populate: {
          path: 'movies',
          populate: 'genres director writers actors',
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Query for genres by name, and return, with their referenced movies populated
   * @param genres GenreInput[] - an array of genres to search for
   * @type {GenreInput} {name: string}
   * @returns gql'[Genre!]' - an array of genres, with their movies, and references populated
   */
  @Query('genres')
  async genres(@Args('genres') genres: GenreInput[]) {
    try {
      return await this.movieDbService.getGenres({
        genres,
        populate: {
          path: 'movies',
          populate: 'genres director writers actors',
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Get all movies, and populate their references
   * @returns gql'[Movie!]' an array of movies, with their references populated
   */
  @Query('movies')
  async movies() {
    try {
      return await this.movieDbService.getMovies({
        populate: 'genres director writers actors trailers',
      });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Query for writers by name, and return found documents, with their referenced movies populated
   * @param writers WriterInput[] - an array of writers to search for
   * @type {WriterInput} {name: string}
   * @returns gql`[Writer!]` - an array of writer documents, with their movies, and references populated
   */
  @Query('writers')
  async writers(@Args('writers') writers: WriterInput[]) {
    try {
      return await this.movieDbService.getWriters({
        writers,
        populate: {
          path: 'movies',
          populate: 'genres director writers actors',
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Query single User by Auth, and return, with their referenced movies populated
   * @param userAuth userAuth - the userAuth object containing the user's id and username
   * @type {userAuth} {id: string}
   * @returns gql'User' - a user, with their movies, and references populated
   */
  @Query('userMovies')
  @UseGuards(GqlJwtAuthGuard)
  async userMovies(
    @CurrentUser()
    userAuth: userAuth,
  ) {
    try {
      console.log(userAuth);
      const userID = await this.movieDbService.getUser(userAuth);
      return await this.movieDbService.getUserMovies({
        userID,
        populate: {
          path: 'movies',
          populate: 'genres director writers actors',
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Add movies, with references, to a user's list, creating those that don't exist
   * @param userAuth userAuth - the userAuth object containing the user's id and username
   * @param movies createMovieInput[] - an array of movies to add to the user's list
   * @returns gql'User' - a user, with their movies, and references populated
   */
  @Mutation('addMovies')
  @UseGuards(GqlJwtAuthGuard)
  async addMovies(
    @CurrentUser() userAuth: userAuth,
    @Args('movies') movies: CreateMovieInput[],
  ) {
    try {
      console.log(userAuth);
      const userID = await this.movieDbService.getUser(userAuth);

      return await this.movieDbService.getUserMovies({
        userID: await this.movieDbService.addMoviesToUser(userID, movies),
        populate: {
          path: 'movies',
          populate: 'genres director writers actors',
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Remove a movie from a user's list
   * @param userAuth userAuth - the userAuth object containing the user's id and username
   * @param id string - the id of the movie to remove
   * @returns gql'User' - updated user, with their movies, and references populated
   */
  @Mutation('removeMovieFromUser')
  @UseGuards(GqlJwtAuthGuard)
  async remove(@CurrentUser() userAuth: userAuth, @Args('id') id: string) {
    try {
      console.log(id);
      const user = await this.movieDbService.removeMoviefromUser({
        userID: userAuth.id,
        movieID: id,
        populate: {
          path: 'movies',
          populate: 'genres director writers actors',
        },
      });
      console.log(user);
      return user;
    } catch (error) {
      console.log(error);
    }
  }
}
