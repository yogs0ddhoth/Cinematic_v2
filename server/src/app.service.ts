import { Injectable } from '@nestjs/common';
import { Types as MongooseTypes } from 'mongoose';

import { CreateMovieInput } from './graphql';
import { CreateMovie } from './models/movie/dto/create-movie.dto';
import { CreateGenre } from './models/genre/dto/create-genre.dto';
import { CreateStar } from './models/star/dto/create-star.dto';
import { userAuth } from './auth/dto/user-auth.dto';

import { UserDocument } from './models/schemas/user.schema';

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

  async addGenre({ name }: CreateGenre): Promise<MongooseTypes.ObjectId> {
    const genre = await this.genreService.get({ filter: { name } });
    if (genre) {
      console.log('Found genre:', genre._id);
      return genre._id;
    }
    const { _id } = await this.genreService.create({ name });
    console.log('Created genre:', _id);
    return _id;
  }

  async addMovie(
    movie: CreateMovie,
    genreIDs: MongooseTypes.ObjectId[],
    starIDs: MongooseTypes.ObjectId[],
  ): Promise<MongooseTypes.ObjectId> {
    const existingMovie = await this.movieService.get({
      filter: { title: movie.title },
    });
    if (existingMovie) {
      console.log('Found movie:', existingMovie._id);

      const { _id } = existingMovie;
      const updatedMovie = await this.movieService.update({
        _id,
        update: {
          $addToSet: {
            genres: { $each: genreIDs },
            stars: { $each: starIDs },
          },
        },
      });
      if (!updatedMovie)
        throw new Error('Error: could not update movie', {
          cause: {
            value: { existingMovie },
          },
        });
      return updatedMovie._id;
    }
    const { _id } = await this.movieService.create({
      ...movie,
      genres: genreIDs,
      stars: starIDs,
    });
    if (!_id)
      throw new Error('Error: could not create movie', {
        cause: {
          value: { movie },
        },
      });
    console.log('updated movie:', _id);
    return _id;
  }

  async addStar({ name }: CreateStar): Promise<MongooseTypes.ObjectId> {
    const star = await this.starService.get({ filter: { name } });
    if (star) {
      console.log('Found star:', star._id);
      return star._id;
    }
    const { _id } = await this.starService.create({ name });
    console.log('Created star:', _id);
    return _id;
  }

  async addMovies(
    movies: CreateMovieInput[],
  ): Promise<MongooseTypes.ObjectId[]> {
    return await Promise.all(
      movies.map(async ({ genres, stars, ...movie }) => {
        const genreIDs: MongooseTypes.ObjectId[] = genres
          ? await Promise.all(
              genres.map(async (genre) => await this.addGenre(genre)),
            )
          : [];

        const starIDs: MongooseTypes.ObjectId[] = stars
          ? await Promise.all(
              stars.map(async (star) => await this.addStar(star)),
            )
          : [];

        return this.addMovie(movie, genreIDs, starIDs);
      }),
    );
  }
  async addMoviesToUser(
    id: string,
    movies: CreateMovieInput[],
  ): Promise<UserDocument> {
    const movieIDs = await this.addMovies(movies);

    const updatedUser = await this.userService.update({
      id,
      update: {
        $addToSet: {
          movies: { $each: movieIDs },
        },
      },
      options: {
        populate: {
          path: 'movies',
          populate: {
            path: 'stars genres',
          },
        },
      },
    });
    if (!updatedUser)
      throw new Error('Error: could not update User:', {
        cause: {
          value: { id, movieIDs },
        },
      });
    return updatedUser;
  }

  async getUser(userAuth: userAuth): Promise<string> {
    const { id, username } = userAuth;
    const user = await this.userService.get({ id });

    if (user) {
      return user._id;
    }
    const { _id } = await this.userService.create({
      _id: id,
      username: username,
    });
    return _id;
  }
}
