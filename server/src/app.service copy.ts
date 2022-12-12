import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { CreateMovieInput, GenreInput, StarInput } from './graphql';
import { GenreService } from './models/genre/genre.service';
import { MovieService } from './models/movie/movie.service';
import { StarService } from './models/star/star.service';
import { UserService } from './models/user/user.service';

/** THE NICE VERSION THAT SHOULD HAVE WORKED - SEE ROOT README */
@Injectable()
export class AppService {
  includeMovies: { movies: true };
  includeStarsAndGenres: {
    genres: true;
    stars: true;
  };

  selectID: { id: true };

  constructor(
    private readonly genreService: GenreService,
    private readonly movieService: MovieService,
    private readonly starService: StarService,
    private readonly userService: UserService,
  ) {}

  async getMovies() {
    return this.movieService.findAll({
      include: this.includeStarsAndGenres,
    });
  }
  async getMovieByID(id: string) {
    return this.movieService.findOne({ where: { id } });
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

  /**
   * Create Movie if doesn't exist and add relationship to User by ID
   * @returns added Movie ID
   */
  async addUserMovie(
    // movieInput: CreateMovieInput,
    movie: Prisma.MovieCreateInput,
    userID: string,
  ): Promise<string> {
    // const { genres, stars, ...movie } = movieInput;
    const imDbID = movie.imDbID;
    const { id: movieID } = imDbID
      ? await this.movieService.upsert({
          where: { imDbID },
          create: {
            ...movie,
            userIDs: [userID],
          },
          update: {
            userIDs: {
              push: userID,
            },
          },
          select: this.selectID,
        })
      : await this.movieService.upsert({
          where: { title: movie.title },
          create: {
            ...movie,
            userIDs: [userID],
          },
          update: {
            userIDs: {
              push: userID,
            },
          },
          select: this.selectID,
        });

    if (!movieID)
      throw new Error('Prisma could not create Movie:', {
        cause: { value: movie },
      });
    return movieID;
  }
  /**
   * Create Genre if doesn't exist, and add relationship to Movie by ID
   * @returns Genre ID
   */
  async addMovieGenre({ name }: GenreInput, movieID: string) {
    const { id } = await this.genreService.upsert({
      where: { name },
      create: {
        name,
        movieIDs: [movieID],
      },
      update: {
        movieIDs: { push: movieID },
      },
      select: this.selectID,
    });

    if (!id)
      throw new Error('Prisma could not upsert Genre:', {
        cause: { value: name },
      });
    return id;
  }
  /**
   * Create Star if doesn't exist, and add relationship to Movie by ID
   * @returns Star ID
   */
  async addMovieStar({ name }: StarInput, movieID: string) {
    const { id } = await this.starService.upsert({
      where: { name },
      create: {
        name,
        movieIDs: [movieID],
      },
      update: {
        movieIDs: { push: movieID },
      },
      select: this.selectID,
    });

    if (!id)
      throw new Error('Prisma could not upsert Star:', {
        cause: { value: name },
      });
    return id;
  }

  async addUser(data: { id: string; username: string }) {
    return this.userService.createUser({
      data,
      include: this.includeMovies,
    });
  }
  async addMovies(
    user: { id: string; username: string },
    movies: CreateMovieInput[],
  ) {
    const userID = await this.getUser(user);

    const movieIDs = await Promise.all(
      movies.map(async ({ genres, stars, ...movie }) => {
        const movieID = await this.addUserMovie(movie, userID);

        // const genreIDs = genres
        //   ? await Promise.all(
        //       genres.map(async (genre) => {
        //         const id = movieID.slice();
        //         return this.addMovieGenre(genre, id);
        //       }),
        //     )
        //   : undefined;

        // const starIDs = stars
        //   ? await Promise.all(
        //       stars.map(async (star) => {
        //         const id = movieID.slice();
        //         return this.addMovieStar(star, id);
        //       }),
        //     )
        //   : undefined;

        // const { id } = await this.movieService.update({
        //   where: { id: movieID },
        //   data: {
        //     genreIDs: { push: genreIDs },
        //     starIDs: { push: starIDs },
        //   },
        //   select: this.selectID,
        // });

        // if (!id)
        //   throw new Error('Prisma could not add Genres and Stars to Movie:', {
        //     cause: {
        //       value: {
        //         id: movieID,
        //         push: [genreIDs, starIDs],
        //       },
        //     },
        //   });
        // return id;
        return movieID;
      }),
    );

    return await this.userService.updateUser({
      where: {
        id: userID,
      },
      data: {
        movieIDs: {
          push: movieIDs,
        },
      },
      include: {
        movies: 
        // {
        //   include: this.includeStarsAndGenres,
        // },
        true,
      },
    });
  }
}
