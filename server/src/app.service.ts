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
   * Query database for the referenced Genre and add Movie reference if doesn't exist, create one if doesn't exist
   * @param CreateGenre - { name: string }
   * @returns the associated Genre ID as a Mongoose ObjectId
   * @throws {Error} if upsert is unsuccessful, or returns null
   */
  async addGenre({
    name,
    movieID,
  }: CreateGenre): Promise<mongoose.Types.ObjectId> {
    try {
      // find document by filter and add reference to movies if not present;
      const genre = await this.genreService.update({
        // get document and add reference to movies if not present;
        filter: { name },
        update: {
          $addToSet: {
            movies: movieID,
          },
        },
        options: {
          new: true,
          // create document with reference if none found;
          upsert: true,
        },
      });

      if (!genre)
        // catch null return values
        throw new Error('Error: findOneAndUpdate returned null', {
          cause: {
            value: {
              movieID,
              filter: name,
              options: {
                new: true,
                upsert: true,
              },
            },
          },
        });
      return genre._id; // return the document ID
    } catch (error) {
      throw error;
    }
  }

  /**
   * Query database for the referenced Actor and add Movie reference if doesn't exist, create one if doesn't exist
   * @param CreateActor - { name: string }
   * @returns the associated Actor ID as a Mongoose ObjectId
   * @throws {Error} if upsert is unsuccessful, or returns null
   */
  async addActor({
    name,
    movieID,
  }: CreateActor): Promise<mongoose.Types.ObjectId> {
    try {
      // find document by filter and add reference to movies if not present;
      const actor = await this.actorService.update({
        filter: { name },
        update: {
          $addToSet: {
            movies: movieID,
          },
        },
        options: {
          new: true,
          // create document with reference if none found;
          upsert: true,
        },
      });
      if (!actor)
        // catch null return values
        throw new Error('Error: findOneAndUpdate returned null', {
          cause: {
            value: {
              movieID,
              filter: name,
              options: {
                new: true,
                upsert: true,
              },
            },
          },
        });
      return actor._id; // return the document ID
    } catch (error) {
      throw error;
    }
  }

  /**
   * Query database for the associated movie, and create one if doesn't exist
   * @param genres - Array<{ name: string }>
   * @param actors - Array<{ name: string }>
   * @param movie type: CreateMovie
   * @type {CreateMovie} see './models/movie/dto/create-movie.dto.ts'
   * @returns the associated Movie ID as a Mongoose ObjectId
   * @throws {Error} if MongooseError, or update returns null
   */
  async addMovie({
    genres,
    actors,
    ...movie
  }: CreateMovieInput): Promise<mongoose.Types.ObjectId> {
    try {
      const existingMovie = await this.movieService.get({
        filter: movie.imdbID
          ? { imdbID: movie.imdbID }
          : { title: movie.title },
      }); // query the database for movie by imdbID or unique name

      const { _id: movieID } = existingMovie
        ? existingMovie
        : await this.movieService.create(movie); // create document if not found

      const genreIDs: mongoose.Types.ObjectId[] = genres
        ? ((
            await Promise.all(
              genres.map(
                // add movie reference to genres, create documents if not found
                async ({ name }) => {
                  try {
                    return await this.addGenre({ name, movieID });
                  } catch (error) {
                    // throw MongooseErrors, log null return values
                    if (error instanceof mongoose.MongooseError) {
                      throw error;
                    }
                    console.log(error);
                  }
                },
              ),
            )
          ).filter(
            // filter out possible undefined results due to errors
            (result) => result instanceof mongoose.Types.ObjectId,
          ) as mongoose.Types.ObjectId[])
        : [];

      const actorIDs: mongoose.Types.ObjectId[] = actors
        ? ((
            await Promise.all(
              // add movie reference to actors, create documents if not found
              actors.map(async ({ name }) => {
                try {
                  return await this.addActor({ name, movieID });
                } catch (error) {
                  // throw MongooseErrors, log null return values
                  if (error instanceof mongoose.MongooseError) {
                    throw error;
                  }
                  console.log(error);
                }
              }),
            )
          ).filter(
            // filter out possible undefined results due to errors
            (result) => result instanceof mongoose.Types.ObjectId,
          ) as mongoose.Types.ObjectId[])
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
        // catch possible null return value
        throw new Error('Error: findOneAndUpdate returned null', {
          cause: {
            value: { existingMovie, genreIDs, actorIDs },
          },
        });
      return updatedMovie._id; // return created document ID
    } catch (error) {
      throw error;
    }
  }

  /**
   * Add Movies and references to database if they do not exist
   * @param {CreateMovieInput[]} movies an array of movies to add
   * @type {CreateMovieInput} see graphql.ts
   * @returns an array of the associated Movie IDs as Mongoose ObjectIds
   */
  async addMovies(
    movies: CreateMovieInput[],
  ): Promise<mongoose.Types.ObjectId[]> {
    return (
      await Promise.all(
        movies.map(async (movie) => {
          try {
            // query movie ID, creating documents that don't exist
            const { _id: movieID } = await this.addMovie(movie);
            return movieID;
          } catch (error) {
            // throw MongooseErrors, log null return values
            if (error instanceof mongoose.MongooseError) {
              throw error;
            }
            console.log(error);
          }
        }),
      )
    ).filter(
      // filter out possible undefined responses due to errors
      (result) => result instanceof mongoose.Types.ObjectId,
    ) as mongoose.Types.ObjectId[];
  }

  /**
   * Query Movie documents, creating those that don't exist, and add reference to the User by id
   * @param id _id of the user
   * @param movies an array of type CreateMovieInput to be added the Database as Movie subdocuments if they don't exist, and attached to the User document
   * @returns Promise: the associated User ID as a string
   * @throws {Error} if update returns null
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
      // catch possible null return value
      throw new Error('Error: findByIdAndUpdate returned null', {
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
      throw new Error('Error: could not findOne User by id filter', {
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
