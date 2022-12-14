import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  FilterQuery,
  Model,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';

import { Star, StarDocument } from '../schemas/star.schema';
import { CreateStar } from './dto/create-star.dto';

@Injectable()
export class StarService {
  constructor(
    @InjectModel(Star.name) private readonly StarModel: Model<StarDocument>,
  ) {}

  async create(doc: CreateStar) {
    return this.StarModel.create(doc);
  }

  async get(params: {
    filter: FilterQuery<StarDocument>;
    projection?: ProjectionType<StarDocument>;
    options?: QueryOptions<StarDocument>;
  }) {
    const { filter, projection, options } = params;
    return this.StarModel.findOne(filter, projection, options).exec();
  }

  async update(params: {
    filter: FilterQuery<StarDocument>;
    update: UpdateQuery<StarDocument>;
    options?: QueryOptions<StarDocument>;
  }) {
    const { filter, update, options } = params;
    return this.StarModel.findOneAndUpdate(filter, update, options).exec();
  }

  async delete(params: { id: string }) {
    const { id } = params;
    return this.StarModel.findByIdAndDelete(id).exec();
  }
}
