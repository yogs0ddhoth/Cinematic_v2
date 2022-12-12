import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, ResolveField } from '@nestjs/graphql';
import { Movie, User } from '@prisma/client';
import { CreateMovieInput, UpdateMovieInput } from 'src/graphql';
import { AppService } from './app.service';
import { CurrentUser, GqlJwtAuthGuard } from './auth/jwt-auth.guard';

@Resolver('Movie')
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Query('movies')
  @UseGuards(GqlJwtAuthGuard)
  async movies(
    @CurrentUser()
    user: {
      id: string;
      username: string;
    },
  ) {
    try {
      console.log(user);
      return await this.appService.getUser(user);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @Query('movie')
  async movie(@Args('id') id: string): Promise<Movie | null> {
    try {
      return await this.appService.getMovieByID(id);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @Mutation('addMovies')
  @UseGuards(GqlJwtAuthGuard)
  async addMovies(
    @CurrentUser()
    user: { id: string; username: string },
    @Args('movies')
    movies: CreateMovieInput[],
  ) {
    // let trying;
    // do {
    //   try {
    //     trying = false;
    //     return await this.appService.addMovies(user, movies);
    //   } catch (error) {
    //     console.log(error);
    //     trying = true;
    //   }
    // } while (trying);
    try {
      const createdMovies = await Promise.all(
        movies.map((movie) => this.appService.addMovie(movie)),
      );
      console.log(createdMovies);
      return await this.appService.getUser(user);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @Mutation('updateMovie')
  async updateMovie(
    @Args('updateMovieInput') updateMovieInput: UpdateMovieInput,
  ) {
    try {
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @Mutation('removeMovie')
  @UseGuards(GqlJwtAuthGuard)
  async remove(@Args('id') id: string) {
    try {
      // return this.moviesService.remove();
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  // @ResolveField('')
}
