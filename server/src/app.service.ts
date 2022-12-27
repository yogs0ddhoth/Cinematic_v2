import { Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';

import { CreateMovieInput } from './graphql';
import { CreateGenre } from './models/genre/dto/create-genre.dto';
import { CreateActor } from './models/actor/dto/create-actor.dto';
import { userAuth } from './auth/dto/user-auth.dto';

import { UserDocument } from './models/schemas/user.schema';

import { GenreService } from './models/genre/genre.service';
import { MovieService } from './models/movie/movie.service';
import { ActorService } from './models/actor/actor.service';
import { UserService } from './models/user/user.service';

@Injectable()
export class AppService {
  constructor(
    private readonly genreService: GenreService,
    private readonly movieService: MovieService,
    private readonly actorService: ActorService,
    private readonly userService: UserService,
  ) {}

  /**
   * Query database for the Genre, and create one if it doesn't exist
   * @param CreateGenre
   * @returns Promise: the associated Genre ID as a Mongoose ObjectId
   * @type {CreateGenre} { name: string }
   */
  async addGenre({
    name,
    movieID,
  }: CreateGenre): Promise<mongoose.Types.ObjectId> {
    // const genre = await this.genreService.get({ filter: { name } }); // query the database for genre by unique name

    try {
      // get document and add reference to movies if not present;
      // create document with reference if none found;
      const genre = await this.genreService.update({
        filter: { name },
        update: {
          $addToSet: {
            movies: movieID,
          },
        },
        options: {
          new: true,
          upsert: true,
        },
      });
      if (!genre)
        // error handling
        throw new Error('Error: could not findOneAndUpdate ', {
          cause: {
            value: { genre: name, movieID, upsert: true },
          },
        });
      return genre._id; // return the document ID
    } catch (error) {
      throw error;
    }
  }

  /**
   * Query database for the Actor, and create one if it doesn't exist
   * @param CreateActor
   * @returns Promise: the found Actor ID as a Mongoose ObjectId
   * @type {CreateActor} { name: string }
   */
  async addActor({
    name,
    movieID,
  }: CreateActor): Promise<mongoose.Types.ObjectId> {
    try {
      // get document and add reference to movies if not present;
      // create document with reference if none found;
      const actor = await this.actorService.update({
        filter: { name },
        update: {
          $addToSet: {
            movies: movieID,
          },
        },
        options: {
          new: true,
          upsert: true,
        },
      });
      if (!actor)
        // error handling
        throw new Error('Error: could not findOneAndUpdate ', {
          cause: {
            value: { actor: name, movieID, upsert: true },
          },
        });
      return actor._id; // return the document ID
    } catch (error) {
      throw error;
    }
  }

  /**
   * Query database for the associated movie, and create one if it doesn't exist
   * @param {CreateMovie} movie type: CreateMovie
   * @param genreIDs type mongoose.Types.ObjectId document references
   * @param actorIDs type mongoose.Types.ObjectId document references
   * @returns Promise: the associated Movie ID as a Mongoose ObjectId
   * @type {CreateMovie}
   *
   * {
   *   imDbID?: string | null;
   *
   *   title: string;
   *
   *   year?: string | null;
   *
   *   released?: string | null;
   *
   *   contentRating?: string | null;
   *
   *   runtime?: string | null;
   *
   *   director?: string | null;
   *
   *   writer?: string | null;
   *
   *   plot?: string | null;
   *
   *   language?: string | null;
   *
   *   country?: string | null;
   *
   *   awards?: string | null;
   *
   *   image?: string | null;
   *
   *   ratings?: { source: string; score: string }[] | null;
   *
   *   imdbVotes?: string | null;
   *
   *   boxOffice?: string | null;
   *
   *   production?: string | null;
   * }
   */
  async addMovie({
    genres,
    actors,
    ...movie
  }: CreateMovieInput): Promise<mongoose.Types.ObjectId> {
    const existingMovie = await this.movieService.get({
      filter: movie.imdbID ? { imdbID: movie.imdbID } : { title: movie.title },
    }); // query the database for movie by imdbID or unique name

    const { _id: movieID } = existingMovie
      ? existingMovie
      : await this.movieService.create(movie); // create document if not found

    const genreIDs: mongoose.Types.ObjectId[] = genres
      ? await Promise.all(
          genres.map(
            // add movie reference to genres, create documents if not found
            async ({ name }) => await this.addGenre({ name, movieID }),
          ),
        )
      : [];
    const actorIDs: mongoose.Types.ObjectId[] = actors
      ? await Promise.all(
          // add movie reference to actors, create documents if not found
          actors.map(
            async ({ name }) => await this.addActor({ name, movieID }),
          ),
        )
      : [];
    // add Genre and Actor references to Movie, if not there already
    const updatedMovie = await this.movieService.update({
      _id: movieID,
      update: {
        $addToSet: {
          genres: { $each: genreIDs },
          actors: { $each: actorIDs },
        },
      },
      options: {
        select: '_id',
      },
    });
    if (!updatedMovie)
      // handle possible errors
      throw new Error('Error: could not update movie', {
        cause: {
          value: { existingMovie, genreIDs, actorIDs },
        },
      });
    return updatedMovie._id; // return created document ID
  }

  /**
   * Add Movies to database if they do not exist
   * @param {CreateMovieInput[]} movies type: CreateMovieInput[]
   * @returns Promise: an array of the associated Movie IDs as Mongoose ObjectIds
   * @type {CreateMovieInput} see graphql.ts
   */
  async addMovies(
    movies: CreateMovieInput[],
  ): Promise<mongoose.Types.ObjectId[]> {
    return await Promise.all(
      movies.map(async (movie) => {
        const { _id: movieID } = await this.addMovie(movie);

        // query movie ID, creating documents that don't exist
        return movieID;
      }),
    );
  }

  /**
   * Query Movie documents, creating those that don't exist, and add reference to the User by id
   * @param id _id of the user
   * @param movies an array of type CreateMovieInput to be added the Database as Movie subdocuments if they don't exist, and attached to the User document
   * @returns Promise: the associated User ID as a string
   */
  async addMoviesToUser(
    id: string,
    movies: CreateMovieInput[],
  ): Promise<string> {
    const movieIDs = await this.addMovies(movies); // query Movie document IDs, creating documents if they don't exist

    // Update User document with the Movie references
    const updatedUser = await this.userService.update({
      id,
      update: {
        $addToSet: {
          movies: { $each: movieIDs },
        },
      },
      options: {
        select: '_id',
      },
    });

    if (!updatedUser)
      throw new Error('Error: could not update User:', {
        cause: {
          value: { id, movieIDs },
        },
      });
    return updatedUser._id;
  }

  /**
   * Query database for associated User document, creating one if it doesn't exist
   * @param userAuth the user information
   * @returns Promise: the associated User ID as a string
   * @type {userAuth} { id: string, username: string }
   */
  async getUser(userAuth: userAuth): Promise<string> {
    const { id, username } = userAuth;
    const user = await this.userService.get({
      id,
      options: {
        select: '_id',
      },
    }); // query document

    const { _id } = user
      ? user
      : // create document if it doesn't exist
        await this.userService.create({
          _id: id,
          username: username,
        });
    return _id; // return document ID
  }

  /**
   * Query User document, and return with populated references
   *
   * @param id User ID as string
   * @returns Promise: UserDocument - the user id, username, and a nested array of Movie subdocuments
   * @error this method is only intended for existing User documents, and will throw an error if one does not exist
   */
  async getUserMovies(id: string): Promise<UserDocument> {
    const user = await this.userService.get({
      id,
      options: {
        populate: {
          path: 'movies',
          populate: 'genres actors',
        },
      },
    });
    if (!user)
      // throw error if document does not exist
      throw new Error('Error: could not find User', {
        cause: { value: id },
      });
    return user;
  }

  async removeMoviefromUser(userID: string, movieID: string) {
    return await this.userService.update({
      id: userID,
      update: {
        $pull: {
          movies: { _id: movieID },
        },
      },
      options: {
        populate: {
          path: 'movies',
          populate: 'genres stars',
        },
      },
    });
  }
}
