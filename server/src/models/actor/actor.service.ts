import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  FilterQuery,
  Model,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';

import { Actor, ActorDocument } from '../schemas/actor.schema';
import { CreateActor } from './dto/create-actor.dto';

@Injectable()
export class ActorService {
  constructor(
    @InjectModel(Actor.name) private readonly ActorModel: Model<ActorDocument>,
  ) {}

  async create(doc: CreateActor) {
    return this.ActorModel.create(doc);
  }

  async get(params: {
    filter: FilterQuery<ActorDocument>;
    projection?: ProjectionType<ActorDocument>;
    options?: QueryOptions<ActorDocument>;
  }) {
    const { filter, projection, options } = params;
    return this.ActorModel.findOne(filter, projection, options).exec();
  }

  async update(params: {
    filter: FilterQuery<ActorDocument>;
    update: UpdateQuery<ActorDocument>;
    options?: QueryOptions<ActorDocument>;
  }) {
    const { filter, update, options } = params;
    return this.ActorModel.findOneAndUpdate(filter, update, options).exec();
  }

  async delete(params: { id: string }) {
    const { id } = params;
    return this.ActorModel.findByIdAndDelete(id).exec();
  }
}
