import { Resolver, Query, Mutation, Args, ResolveField } from '@nestjs/graphql';
import { CreateMovieInput, UpdateMovieInput } from 'src/graphql';
import { AppService } from './app.service';

@Resolver('Movie')
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Query('movies')
  async movies() {
    try {
      return await this.appService.getMovies();
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @Query('movie')
  async movie(@Args('id') id: string) {
    try {
      return await this.appService.getMovieByID(id);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @Mutation('addMovies')
  async addMovies(@Args('movies') createMovieInput: CreateMovieInput[]) {
    try {
      return await Promise.all(
        createMovieInput.map(
          async (movie) => await this.appService.addMovie(movie),
        ),
      );
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
