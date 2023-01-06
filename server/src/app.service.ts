import { Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';

import {
  ActorInput,
  CreateMovieInput,
  DirectorInput,
  GenreInput,
  WriterInput,
} from './graphql';
import { CreateGenre } from './models/genre/dto/create-genre.dto';
import { CreateActor } from './models/actor/dto/create-actor.dto';
import { userAuth } from './auth/dto/user-auth.dto';

import { UserDocument } from './models/schemas/user.schema';

import { ActorService } from './models/actor/actor.service';
import { DirectorService } from './models/director/director.service';
import { GenreService } from './models/genre/genre.service';
import { MovieService } from './models/movie/movie.service';
import { UserService } from './models/user/user.service';
import { WriterService } from './models/writer/writer.service';

import { ActorDocument } from './models/schemas/actor.schema';
import { DirectorDocument } from './models/schemas/director.schema';
import { GenreDocument } from './models/schemas/genre.schema';
import { MovieDocument } from './models/schemas/movie.schema';
import { WriterDocument } from './models/schemas/writer.schema';

import { CreateDirector } from './models/director/dto/create-director.dto';
import { CreateWriter } from './models/writer/dto/create-writer.dto';

@Injectable()
export class AppService {
  constructor(
    private readonly actorService: ActorService,
    private readonly directorService: DirectorService,
    private readonly genreService: GenreService,
    private readonly movieService: MovieService,
    private readonly userService: UserService,
    private readonly writerService: WriterService,
  ) {}

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
   * Query database for the referenced Director and add Movie reference if doesn't exist, create one if doesn't exist
   * @param param0
   * @returns
   */
  async addDirector({
    name,
    movieID,
  }: CreateDirector): Promise<mongoose.Types.ObjectId> {
    try {
      // find document by filter and add reference to movies if not present;
      const director = await this.directorService.update({
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

      if (!director)
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
      return director._id; // return the document ID
    } catch (error) {
      throw error;
    }
  }

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
   * TODO: add documentation
   * @param param0
   * @returns
   */
  async addWriter({
    name,
    movieID,
  }: CreateWriter): Promise<mongoose.Types.ObjectId> {
    try {
      // find document by filter and add reference to movies if not present;
      const writer = await this.writerService.update({
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

      if (!writer)
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
      return writer._id; // return the document ID
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
    actors,
    director,
    genres,
    writers,
    ...movie
  }: CreateMovieInput): Promise<mongoose.Types.ObjectId> {
    try {
      const foundMovie = await this.movieService.find({
        filter: movie.imdbID
          ? { imdbID: movie.imdbID }
          : { title: movie.title },
      }); // query the database for movie by imdbID or unique name

      const { _id: movieID } = foundMovie
        ? foundMovie
        : await this.movieService.create(movie); // create document if not found

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

      const directorID: mongoose.Types.ObjectId | undefined = director
        ? await this.addDirector({ name: director.name, movieID })
        : undefined;

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

      const writerIDs: mongoose.Types.ObjectId[] = writers
        ? ((
            await Promise.all(
              writers.map(
                // add movie reference to writers, create documents if not found
                async ({ name }) => {
                  try {
                    return await this.addWriter({ name, movieID });
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

      // add Genre and Actor references to Movie, if not there already
      const updatedMovie = await this.movieService.update({
        _id: movieID,
        update: {
          director: directorID,
          $addToSet: {
            genres: { $each: genreIDs },
            actors: { $each: actorIDs },
            writers: { $each: writerIDs },
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
            value: { foundMovie, genreIDs, actorIDs },
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
   * TODO: add documentation
   * @param actors
   * @param populate
   * @returns
   */
  async getActors(params: {
    actors: ActorInput[];
    populate?:
      | string
      | string[]
      | mongoose.PopulateOptions
      | mongoose.PopulateOptions[];
  }): Promise<ActorDocument[]> {
    try {
      const { actors, populate } = params;
      const actorNames = actors.map(({ name }) => name);
      const foundActors = await this.actorService.get({
        filter: {
          name: { $in: actorNames },
        },
        options: {
          populate,
        },
      });
      if (foundActors) {
        return foundActors;
      }
      return [] as ActorDocument[];
    } catch (error) {
      throw error;
    }
  }

  /**
   * TODO: add documentation
   * @param directors
   * @param populate
   * @returns
   */
  async getDirectors(params: {
    directors: DirectorInput[];
    populate?:
      | string
      | string[]
      | mongoose.PopulateOptions
      | mongoose.PopulateOptions[];
  }): Promise<DirectorDocument[]> {
    try {
      const { directors, populate } = params;
      const directorNames = directors.map(({ name }) => name);
      const foundDirectors = await this.directorService.get({
        filter: {
          name: { $in: directorNames },
        },
        options: {
          populate,
        },
      });
      if (foundDirectors) {
        return foundDirectors;
      }
      return [] as DirectorDocument[];
    } catch (error) {
      throw error;
    }
  }

  /**
   * TODO: add documentation
   * @param genres
   * @param populate
   * @returns
   */
  async getGenres(params: {
    genres: GenreInput[];
    populate?:
      | string
      | string[]
      | mongoose.PopulateOptions
      | mongoose.PopulateOptions[];
  }): Promise<GenreDocument[]> {
    try {
      const { genres, populate } = params;
      const genreNames = genres.map(({ name }) => name);
      const foundGenres = await this.genreService.get({
        filter: {
          name: { $in: genreNames },
        },
        options: {
          populate,
        },
      });
      if (foundGenres) {
        return foundGenres;
      }
      return [] as GenreDocument[];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Query database for all Movie documents
   * @returns Promise: an array of all Movie documents
   */
  async getMovies(params: {
    populate?:
      | string
      | string[]
      | mongoose.PopulateOptions
      | mongoose.PopulateOptions[];
  }): Promise<MovieDocument[]> {
    try {
      const { populate } = params;
      const foundMovies = await this.movieService.get({
        filter: {},
        options: {
          populate,
        },
      });
      if (foundMovies) {
        return foundMovies;
      }
      return [] as MovieDocument[];
    } catch (error) {
      throw error;
    }
  }

  /**
   * TODO: add documentation
   * @param params
   * @returns
   */
  async getWriters(params: {
    writers: WriterInput[];
    populate?:
      | string
      | string[]
      | mongoose.PopulateOptions
      | mongoose.PopulateOptions[];
  }): Promise<WriterDocument[]> {
    try {
      const { writers, populate } = params;
      const writerNames = writers.map(({ name }) => name);
      const foundWriters = await this.writerService.get({
        filter: {
          name: { $in: writerNames },
        },
        options: {
          populate,
        },
      });
      if (foundWriters) {
        return foundWriters;
      }
      return [] as WriterDocument[];
    } catch (error) {
      throw error;
    }
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
    const foundUser = await this.userService.get({
      id,
      options: {
        populate: {
          path: 'movies',
          populate: 'genres directors writers actors',
        },
      },
    });
    if (!foundUser)
      // throw error if document does not exist
      throw new Error('Error: could not findOne User by id filter', {
        cause: { value: id },
      });
    return foundUser;
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
          populate: 'genres directors writers actors',
        },
      },
    });
  }
}
