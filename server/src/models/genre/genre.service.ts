import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ProjectionType, QueryOptions, UpdateQuery } from 'mongoose';

import { Genre, GenreDocument } from '../schemas/genre.schema';

@Injectable()
export class GenreService {
  constructor(
    @InjectModel(Genre.name) private readonly GenreModel: Model<GenreDocument>,
  ) {}

  async create(doc: GenreDocument) {
    return this.GenreModel.create(doc);
  }

  async get(params: {
    id: string;
    projection?: ProjectionType<GenreDocument>;
    options?: QueryOptions<GenreDocument>;
  }) {
    const { id, projection, options } = params;
    return this.GenreModel.findById(id, projection, options).exec();
  }

  async update(params: {
    id: string;
    update: UpdateQuery<GenreDocument>;
    options?: QueryOptions<GenreDocument>;
  }) {
    const { id, update, options } = params;
    return this.GenreModel.findByIdAndUpdate(id, update, options).exec();
  }

  async delete(params: { id: string }) {
    const { id } = params;
    return this.GenreModel.findByIdAndDelete(id).exec();
  }
}
