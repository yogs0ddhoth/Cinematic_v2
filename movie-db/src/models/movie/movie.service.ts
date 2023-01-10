import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  FilterQuery,
  Model,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
  Types,
} from 'mongoose';

import { Movie, MovieDocument } from '../schemas/movie.schema';
import { CreateMovie } from './dto/create-movie.dto';

/**
 * Class containing Mongoose CRUD methods for Movie documents
 */
@Injectable()
export class MovieService {
  constructor(
    @InjectModel(Movie.name) private readonly MovieModel: Model<MovieDocument>,
  ) {}

  /**
   * Mongoose.Model.create(): create a new Movie document or array of documents
   * @param docs CreateMovie | CreateMovie[] document/documents to be created
   * @type {CreateMovie} see './dto/create-movie.dto.ts'
   * @returns created document or array of documents
   */
  async create(docs: CreateMovie | CreateMovie[]) {
    return this.MovieModel.create(docs);
  }

  /**
   *Mongoose Model.findOne(): gets a single document that matches filter
   * @param filter fields to search by
   * @param projection fields to include or exclude
   * @param options query options - see https://mongoosejs.com/docs/api/query.html#query_Query-setOptions
   * @returns a single document, or null if none is found
   */
  async find(params: {
    filter: FilterQuery<MovieDocument>;
    projection?: ProjectionType<MovieDocument>;
    options?: QueryOptions<MovieDocument>;
  }) {
    const { filter, projection, options } = params;
    return this.MovieModel.findOne(filter, projection, options).exec();
  }

  /**
   * Mongoose Model.find(): gets a list of documents that match filter
   * @param filter fields to search by
   * @param projection fields to include or exclude
   * @param options query options - see https://mongoosejs.com/docs/api/query.html#query_Query-setOptions
   * @returns a single document, array of documents, or null if none is found
   */
  async get(params: {
    filter: FilterQuery<MovieDocument>;
    projection?: ProjectionType<MovieDocument>;
    options?: QueryOptions<MovieDocument>;
  }) {
    const { filter, projection, options } = params;
    return this.MovieModel.find(filter, projection, options).exec();
  }

  /**
   * Mongoose Model.findOneAndUpdate(): atomically find the first document that matches filter and apply update
   * @param filter fields to search by
   * @param update field update(s)
   * @param options update options - see https://mongoosejs.com/docs/api/query.html#query_Query-setOptions
   * @returns updated document, or null if none is found (and upsert = false)
   */
  async update(params: {
    _id: Types.ObjectId;
    update: UpdateQuery<MovieDocument>;
    options?: QueryOptions<MovieDocument>;
  }) {
    const { _id, update, options } = params;
    return this.MovieModel.findByIdAndUpdate(_id, update, options).exec();
  }

  /**
   * Mongoose Model.findByIdAndDelete(): delete document by the given _id
   * @param id _id of document to delete
   */
  async delete(params: { id: string }) {
    const { id } = params;
    return this.MovieModel.findByIdAndDelete(id).exec();
  }
}
