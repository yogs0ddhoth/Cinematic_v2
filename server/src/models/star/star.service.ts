import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ProjectionType, QueryOptions, UpdateQuery } from 'mongoose';

import { Star, StarDocument } from '../schemas/star.schema';

@Injectable()
export class StarService {
  constructor(
    @InjectModel(Star.name) private readonly StarModel: Model<StarDocument>,
  ) {}

  async create(doc: StarDocument) {
    return this.StarModel.create(doc);
  }

  async get(params: {
    id: string;
    projection?: ProjectionType<StarDocument>;
    options?: QueryOptions<StarDocument>;
  }) {
    const { id, projection, options } = params;
    return this.StarModel.findById(id, projection, options).exec();
  }

  async update(params: {
    id: string;
    update: UpdateQuery<StarDocument>;
    options?: QueryOptions<StarDocument>;
  }) {
    const { id, update, options } = params;
    return this.StarModel.findByIdAndUpdate(id, update, options).exec();
  }

  async delete(params: { id: string }) {
    const { id } = params;
    return this.StarModel.findByIdAndDelete(id).exec();
  }
}
