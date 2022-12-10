import { Injectable } from '@nestjs/common';
import { CreateMovieInput, GenreInput, StarInput } from './graphql';
import { GenreService } from './models/genre/genre.service';
import { MovieService } from './models/movie/movie.service';
import { StarService } from './models/star/star.service';
import { UserService } from './models/user/user.service';

@Injectable()
export class AppService {
  constructor(
    private readonly genreService: GenreService,
    private readonly movieService: MovieService,
    private readonly starService: StarService,
    private readonly userService: UserService,
  ) {}

  async getMovies() {
    return await this.movieService.findAll({
      include: {
        genres: true,
        stars: true,
      },
    });
  }
  async getMovieByID(id: string) {
    return await this.movieService.findOne({ where: { id } });
  }

  async addGenres(genres: GenreInput[], movieID: string) {
    return Promise.all(
      genres.map(async ({ name }) => {
        const { id } = await this.genreService.upsert({
          where: { name },
          create: {
            name,
            movieIDs: [movieID],
          },
          update: {
            movieIDs: { push: movieID },
          },
          select: { id: true },
        });

        if (!id)
          throw new Error('Could not upsert Genre:', {
            cause: { value: name },
          });
        return id;
      }),
    );
  }
  async addMovie({ genres, stars, ...movie }: CreateMovieInput) {
    const { id } = movie.imDbID
      ? await this.movieService.upsert({
          where: { imDbID: movie.imDbID },
          create: { ...movie },
          update: {},
          select: { id: true },
        })
      : await this.movieService.upsert({
          where: { title: movie.title },
          create: { ...movie },
          update: {},
          select: { id: true },
        });

    if (!id)
      throw new Error('Could not upsert Movie:', {
        cause: { value: movie },
      });

    const genreIDs = genres ? await this.addGenres(genres, id) : undefined;
    const starIDs = stars ? await this.addStars(stars, id) : undefined;

    return this.movieService.update({
      where: { id },
      data: {
        genreIDs: { push: genreIDs },
        starIDs: { push: starIDs },
      },
      include: {
        genres: true,
        stars: true,
      },
    });
  }
  async addStars(stars: StarInput[], movieID: string) {
    return Promise.all(
      stars.map(async ({ name }) => {
        const { id } = await this.starService.upsert({
          where: { name },
          create: {
            name,
            movieIDs: [movieID],
          },
          update: {
            movieIDs: { push: movieID },
          },
          select: { id: true },
        });
        if (!id)
          throw new Error('Could not upsert Star:', {
            cause: { value: name },
          });
        return id;
      }),
    );
  }
}
