import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CreateMovieInput, UpdateMovieInput } from 'src/graphql';
import { MoviesService } from './movies.service';

@Resolver('Movie')
export class MoviesResolver {
  constructor(private readonly moviesService: MoviesService) {}

  @Mutation('createMovie')
  create(@Args('createMovieInput') createMovieInput: CreateMovieInput) {
    return this.moviesService.create(createMovieInput);
  }

  @Mutation('addMovies')
  createMany(@Args('movies') addMoviesInput: CreateMovieInput[]) {
    return this.moviesService.createMany(addMoviesInput);
  }

  @Query('movies')
  findAll() {
    return this.moviesService.findAll();
  }

  @Query('movie')
  findOne(@Args('id') id: string) {
    return this.moviesService.findOne(id);
  }

  @Mutation('updateMovie')
  update(@Args('updateMovieInput') updateMovieInput: UpdateMovieInput) {
    return this.moviesService.update(updateMovieInput.id, updateMovieInput);
  }

  @Mutation('removeMovie')
  remove(@Args('id') id: string) {
    return this.moviesService.remove(id);
  }
}
