import { Injectable } from '@nestjs/common';
import { CreateMovieInput, GenreInput, StarInput } from './graphql';
import { GenreService } from './models/genre/genre.service';
import { MovieService } from './models/movie/movie.service';
import { StarService } from './models/star/star.service';
import { UserService } from './models/user/user.service';

/** EVEN MORE GRANULAR CONCURRENT OPERATIONS WILL CAUSE WRITE CONFLICTS WITH MONGODB - SEE ROOT README */
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
  async getUser(user: { id: string; username: string }) {
    const { id } = await this.userService.upsertUser({
      where: { id: user.id },
      create: user,
      update: {},
    });

    if (!id)
      throw new Error('Prisma could not upsert User:', {
        cause: { value: user },
      });
    return id;
  }

  async addGenres(genres: GenreInput[], movieID: string) {
    return Promise.all(
      genres.map(async ({ name }) => {
        const { id } = await this.genreService.upsert({
          where: { name },
          create: {
            name,
            movieIDs: [movieID.toString()],
          },
          update: {
            movieIDs: { push: movieID.toString() },
          },
          // select: { id: true },
        });

        if (!id)
          throw new Error('Prisma could not upsert Genre:', {
            cause: { value: name },
          });
        return id;
      }),
    );
  }
  async addMovie({ genres, stars, ...movie }: CreateMovieInput) {
    const { id: movieID } = movie.imDbID
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

    if (!movieID)
      throw new Error('Prisma could not upsert Movie:', {
        cause: { value: movie },
      });

    const genreIDs = genres
      ? // ? this.addGenres(genres, movieID.toString())
        await Promise.all(
          genres.map(async ({ name }) => {
            const movieIDClone = movieID.toString();
            try {
              const { id } = await this.genreService.update({
                where: { name },
                data: {
                  movieIDs: { push: movieIDClone },
                },
                // select: { id: true },
              });
              return id;
            } catch (error) {
              if (error.code == 'P2025') {
                const { id } = await this.genreService.create({
                  name,
                  movieIDs: [movieIDClone],
                });
                return id;
              }
              throw error;
            }
          }),
        )
      : undefined;

    const starIDs = stars
      ? await Promise.all(
          stars.map(async ({ name }) => {
            const movieIDClone = movieID.toString();
            try {
              const { id } = await this.starService.update({
                where: { name },
                data: {
                  movieIDs: { push: movieIDClone },
                },
                // select: { id: true },
              });
              return id;
            } catch (error) {
              if (error.code == 'P2025') {
                const { id } = await this.starService.create({
                  name,
                  movieIDs: [movieIDClone],
                });
                return id;
              }
              throw error;
            }
          }),
        )
      : // ? this.addStars(stars, movieID.toString())
        undefined;

    return this.movieService.update({
      where: { id: movieID },
      data: {
        genreIDs: {
          push: genreIDs,
        },
        starIDs: {
          push: starIDs,
        },
      },
      // include: {
      //   genres: true,
      //   stars: true,
      // },
      select: { id: true },
    });
  }
  async addStars(stars: StarInput[], movieID: string) {
    return Promise.all(
      stars.map(async ({ name }) => {
        const { id } = await this.starService.upsert({
          where: { name },
          create: {
            name,
            movieIDs: [movieID.toString()],
          },
          update: {
            movieIDs: { push: movieID.toString() },
          },
          select: { id: true },
        });
        if (!id)
          throw new Error('Prisma could not upsert Star:', {
            cause: { value: name },
          });
        return id;
      }),
    );
  }
}
