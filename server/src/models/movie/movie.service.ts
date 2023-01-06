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

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(Movie.name) private readonly MovieModel: Model<MovieDocument>,
  ) {}

  async create(docs: CreateMovie | CreateMovie[]) {
    return this.MovieModel.create(docs);
  }

  async find(params: {
    filter: FilterQuery<MovieDocument>;
    projection?: ProjectionType<MovieDocument>;
    options?: QueryOptions<MovieDocument>;
  }) {
    const { filter, projection, options } = params;
    return this.MovieModel.findOne(filter, projection, options).exec();
  }

  async get(params: {
    filter: FilterQuery<MovieDocument>;
    projection?: ProjectionType<MovieDocument>;
    options?: QueryOptions<MovieDocument>;
  }) {
    const { filter, projection, options } = params;
    return this.MovieModel.find(filter, projection, options).exec();
  }

  async update(params: {
    _id: Types.ObjectId;
    update: UpdateQuery<MovieDocument>;
    options?: QueryOptions<MovieDocument>;
  }) {
    const { _id, update, options } = params;
    return this.MovieModel.findByIdAndUpdate(_id, update, options).exec();
  }

  async delete(params: { id: string }) {
    const { id } = params;
    return this.MovieModel.findByIdAndDelete(id).exec();
  }
}
