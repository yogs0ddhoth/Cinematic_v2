import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, ResolveField } from '@nestjs/graphql';
import { CreateMovieInput, UpdateMovieInput } from 'src/graphql';
import { AppService } from './app.service';
import { userAuth } from './auth/dto/user-auth.dto';
import { CurrentUser, GqlJwtAuthGuard } from './auth/jwt-auth.guard';

@Resolver('Movie')
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Query('movies')
  @UseGuards(GqlJwtAuthGuard)
  async movies(
    @CurrentUser()
    userAuth: userAuth,
  ) {
    try {
      console.log(userAuth);
      const user = await this.appService.getUser(userAuth);
      return user;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @Query('movie')
  async movie(@Args('id') id: string) {
    try {
      // return await this.appService.getMovieByID(id);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @Mutation('addMovies')
  @UseGuards(GqlJwtAuthGuard)
  async addMovies(
    @CurrentUser()
    userAuth: userAuth,
    @Args('movies')
    movies: CreateMovieInput[],
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
