import { Resolver, Query, Mutation, Args, ResolveField } from '@nestjs/graphql';
import { CreateMovieInput, UpdateMovieInput } from 'src/graphql';
import GenresService from './genres.service';
import { MoviesService } from './movies.service';
import StarsService from './stars.service';
import UsersService from './users.service';

@Resolver('Movie')
export class MoviesResolver {
  constructor(
    private readonly genresService: GenresService,
    private readonly moviesService: MoviesService,
    private readonly starsService: StarsService,
    private readonly usersService: UsersService,
  ) {}

  @Query('movies')
  async movies() {
    return await this.moviesService.findAll();
  }

  @Query('movie')
  async movie(@Args('id') id: string) {
    return await this.moviesService.findOne({ id });
  }

  @Mutation('addMovies')
  async addMovies(@Args('movies') createMovieInput: CreateMovieInput[]) {
    const movieService = this.moviesService;
    return createMovieInput.map(
      async ({ genreList, starList, ...movie }: CreateMovieInput) => {
        const data = {
          ...movie,
          genreList: {
            create: genreList,
          },
          starList: {
            create: starList,
          },
        };
        return await movieService.create({
          data,
          include: {
            genreList: true,
            starList: true,
          },
        });
      },
    );
  }

  @Mutation('updateMovie')
  async updateMovie(
    @Args('updateMovieInput') updateMovieInput: UpdateMovieInput,
  ) {}

  @Mutation('removeMovie')
  async remove(@Args('id') id: string) {
    // return this.moviesService.remove();
  }

  // @ResolveField('')
}
