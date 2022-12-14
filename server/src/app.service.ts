import { Injectable } from '@nestjs/common';
import * as Mongoose from 'mongoose';
import { CreateMovieInput, GenreInput, StarInput } from './graphql';
import { CreateMovie } from './models/movie/dto/create-movie.dto';

import { User, UserDocument } from './models/schemas/user.schema';
import { Movie } from './models/schemas/movie.schema';
import { Genre } from './models/schemas/genre.schema';
import { Star } from './models/schemas/star.schema';

import { GenreService } from './models/genre/genre.service';
import { MovieService } from './models/movie/movie.service';
import { StarService } from './models/star/star.service';
import { UserService } from './models/user/user.service';
import { CreateGenre } from './models/genre/dto/create-genre.dto';
import { CreateStar } from './models/star/dto/create-star.dto';

@Injectable()
export class AppService {
  constructor(
    private readonly genreService: GenreService,
    private readonly movieService: MovieService,
    private readonly starService: StarService,
    private readonly userService: UserService,
  ) {}

  async addGenre({ name }: CreateGenre): Promise<string> {
    const genre = await this.genreService.get({ filter: { name } });
    if (genre) {
      return genre.id;
    } else {
      const { id } = await this.genreService.create({ name });
      return id;
    }
  }
  async addMovie(params: {
    movie: CreateMovie;
    genreIDs: string[];
    starIDs: string[];
  }) {
    console.log('what the fuck');
    const { movie, genreIDs, starIDs } = params;
    const movieDoc = await this.movieService.get({
      filter: { title: params.movie.title },
    });
    if (movieDoc) {
      return movieDoc.id;
    }
    const { _id } = await this.movieService.create(movie);
    if (!_id)
      throw new Error('Error: could not create movie', {
        cause: {
          value: { movie },
        },
      });
    console.log('updated movie:', _id);

    // Needs debugging - mongoose doesn't seem to want to parse the update properly
    const updatedMovie = await this.movieService.update({
      _id,
      update: {
        $addToSet: {
          genres: {
            $each: genreIDs,
          },
        },
      },
    });
    if (!updatedMovie)
      throw new Error('Error: could not update movie', {
        cause: {
          value: { movie },
        },
      });
    return updatedMovie.id;
  }
  async addStar({ name }: CreateStar): Promise<string> {
    const star = await this.starService.get({ filter: { name } });
    if (star) {
      return star.id;
    } else {
      const { id } = await this.starService.create({ name });
      return id;
    }
  }

  async addMovies(movies: CreateMovieInput[]): Promise<string[]> {
    return await Promise.all(
      movies.map(async ({ genres, stars, ...movie }) => {
        // console.log('Movie:', movie);

        const genreIDs: string[] = genres
          ? await Promise.all(
              genres.map(async (genre) => await this.addGenre(genre)),
            )
          : [];
        // console.log('genreIds:', genreIDs);

        const starIDs: string[] = stars
          ? await Promise.all(
              stars.map(async (star) => await this.addStar(star)),
            )
          : [];
        // console.log('starIDs:', starIDs);
        // console.log('\n');

        return this.addMovie({
          movie,
          genreIDs,
          starIDs,
        });
      }),
    );
  }

  // async addMoviesToUser();
  async getUser(user: { id: string; username: string }): Promise<UserDocument> {
    const { id, username } = user;
    const userDoc = await this.userService.get({
      id,
      options: {
        populate: {
          path: 'movies',
          populate: {
            path: 'stars genres',
          },
        },
      },
    });

    if (!userDoc) return this.userService.create({ _id: id, username });
    return userDoc;
  }
}
