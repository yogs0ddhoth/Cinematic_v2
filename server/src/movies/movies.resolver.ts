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
    try {
      return await this.moviesService.findAll({
        include: {
          genres: true,
          stars: true,
        },
      });
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @Query('movie')
  async movie(@Args('id') id: string) {
    try {
      return await this.moviesService.findOne({ where: { id } });
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @Mutation('addMovies')
  async addMovies(@Args('movies') createMovieInput: CreateMovieInput[]) {
    try {
      const movieService = this.moviesService;

      return createMovieInput.map(
        async ({ genres, stars, ...movie }: CreateMovieInput) => {
          return await movieService.create({
            data: {
              ...movie,
              genres: genres ? { create: genres } : undefined,
              stars: stars ? { create: stars } : undefined,
            },
            include: {
              genres: true,
              stars: true,
            },
          });
        },
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
