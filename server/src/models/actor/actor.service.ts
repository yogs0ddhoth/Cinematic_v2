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

  /**
   * create a new Actor document or array of documents
   * @param {CreateActor} doc document/documents to be created
   * @type {CreateActor}  name: string, movieID?: Types.ObjectId | null }
   * @returns created document or documents
   */
  async create(doc: CreateActor | CreateActor[]) {
    return this.ActorModel.create(doc);
  }

  /**
   * TODO: add documentation
   * @param params
   * @returns
   */
  async find(params: {
    filter: FilterQuery<ActorDocument>;
    projection?: ProjectionType<ActorDocument>;
    options?: QueryOptions<ActorDocument>;
  }) {
    const { filter, projection, options } = params;
    return this.ActorModel.findOne(filter, projection, options).exec();
  }

  /**
   * TODO: add documentation
   * @param params
   * @returns
   */
  async get(params: {
    filter: FilterQuery<ActorDocument>;
    projection?: ProjectionType<ActorDocument>;
    options?: QueryOptions<ActorDocument>;
  }) {
    const { filter, projection, options } = params;
    return this.ActorModel.find(filter, projection, options).exec();
  }

  /**
   * Mongoose Model.findOneAndUpdate(): atomically find the first document that matches filter and apply update
   * @param filter fields to search by
   * @param update field update(s)
   * @param options update options - see docs
   * @returns updated document, or null if none is found (and upsert = false)
   */
  async update(params: {
    filter: FilterQuery<ActorDocument>;
    update: UpdateQuery<ActorDocument>;
    options?: QueryOptions<ActorDocument>;
  }) {
    const { filter, update, options } = params;
    return this.ActorModel.findOneAndUpdate(filter, update, options).exec();
  }
  /**
   * TODO: add documentation
   * @param params
   * @returns
   */
  async delete(params: { id: string }) {
    const { id } = params;
    return this.ActorModel.findByIdAndDelete(id).exec();
  }
}
