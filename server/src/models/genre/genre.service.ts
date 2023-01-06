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

@Injectable()
export class GenreService {
  constructor(
    @InjectModel(Genre.name) private readonly GenreModel: Model<GenreDocument>,
  ) {}

  /**
   * TODO: add documentation
   * @param params
   * @returns
   */
  async create(doc: CreateGenre) {
    return this.GenreModel.create(doc);
  }

  /**
   * TODO: add documentation
   * @param params
   * @returns
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
   * TODO: add documentation
   * @param params
   * @returns
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
   * TODO: add documentation
   * @param params
   * @returns
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
   * TODO: add documentation
   * @param params
   * @returns
   */
  async delete(params: { id: string }) {
    const { id } = params;
    return this.GenreModel.findByIdAndDelete(id).exec();
  }
}
