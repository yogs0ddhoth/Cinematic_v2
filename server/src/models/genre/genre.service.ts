import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  FilterQuery,
  Model,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';

import { Genre, GenreDocument } from '../schemas/genre.schema';
import { CreateGenre } from './dto/create-genre.dto';

/**
 * Class containing Mongoose CRUD methods for Genre documents
 */
@Injectable()
export class GenreService {
  constructor(
    @InjectModel(Genre.name) private readonly GenreModel: Model<GenreDocument>,
  ) {}

  /**
   * Mongoosose.Model.create(): creates a new document of array of documents
   * @param doc CreateGenre | CreateGenre[] document/documents to be created
   * @type {CreateGenre} { name: string, movieID?: Types.ObjectId | null }
   * @returns created document or array of documents
   */
  async create(doc: CreateGenre) {
    return this.GenreModel.create(doc);
  }

  /**
   *Mongoose Model.findOne(): gets a single document that matches filter
   * @param filter fields to search by
   * @param projection fields to include or exclude
   * @param options query options - see https://mongoosejs.com/docs/api/query.html#query_Query-setOptions
   * @returns a single document, or null if none is found
   */
  async find(params: {
    filter: FilterQuery<GenreDocument>;
    projection?: ProjectionType<GenreDocument>;
    options?: QueryOptions<GenreDocument>;
  }) {
    const { filter, projection, options } = params;
    return this.GenreModel.findOne(filter, projection, options).exec();
  }

  /**
   * Mongoose Model.find(): gets a list of documents that match filter
   * @param filter fields to search by
   * @param projection fields to include or exclude
   * @param options query options - see https://mongoosejs.com/docs/api/query.html#query_Query-setOptions
   * @returns a single document, array of documents, or null if none is found
   */
  async get(params: {
    filter: FilterQuery<GenreDocument>;
    projection?: ProjectionType<GenreDocument>;
    options?: QueryOptions<GenreDocument>;
  }) {
    const { filter, projection, options } = params;
    return this.GenreModel.find(filter, projection, options).exec();
  }

  /**
   * Mongoose Model.findOneAndUpdate(): atomically find the first document that matches filter and apply update
   * @param filter fields to search by
   * @param update field update(s)
   * @param options update options - see https://mongoosejs.com/docs/api/query.html#query_Query-setOptions
   * @returns updated document, or null if none is found (and upsert = false)
   */
  async update(params: {
    filter: FilterQuery<GenreDocument>;
    update: UpdateQuery<GenreDocument>;
    options?: QueryOptions<GenreDocument>;
  }) {
    const { filter, update, options } = params;
    return this.GenreModel.findOneAndUpdate(filter, update, options).exec();
  }

  /**
   * Mongoose Model.findOneAndUpdate(): atomically find the first document that matches filter and apply update
   * @param filter fields to search by
   * @param update field update(s)
   * @param options update options - see https://mongoosejs.com/docs/api/query.html#query_Query-setOptions
   * @returns updated document, or null if none is found (and upsert = false)
   */
  async delete(params: { id: string }) {
    const { id } = params;
    return this.GenreModel.findByIdAndDelete(id).exec();
  }
}
