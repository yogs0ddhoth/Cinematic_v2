import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ProjectionType, QueryOptions, UpdateQuery } from 'mongoose';

import { Movie, MovieDocument } from '../schemas/movie.schema';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(Movie.name) private readonly MovieModel: Model<MovieDocument>,
  ) {}

  async create(doc: MovieDocument) {
    return this.MovieModel.create(doc);
  }

  async get(params: {
    id: string;
    projection?: ProjectionType<MovieDocument>;
    options?: QueryOptions<MovieDocument>;
  }) {
    const { id, projection, options } = params;
    return this.MovieModel.findById(id, projection, options).exec();
  }

  async update(params: {
    id: string;
    update: UpdateQuery<MovieDocument>;
    options?: QueryOptions<MovieDocument>;
  }) {
    const { id, update, options } = params;
    return this.MovieModel.findByIdAndUpdate(id, update, options).exec();
  }

  async delete(params: { id: string }) {
    const { id } = params;
    return this.MovieModel.findByIdAndDelete(id).exec();
  }
}
