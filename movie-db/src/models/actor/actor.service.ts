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

/**
 * Class containing Mongoose CRUD methods for Actor documents
 */
@Injectable()
export class ActorService {
  constructor(
    @InjectModel(Actor.name) private readonly ActorModel: Model<ActorDocument>,
  ) {}

  /**
   * Mongoose.Model.create(): create a new Actor document or array of documents
   * @param doc CreateActor | CreateActor[] document/documents to be created
   * @type {CreateActor} { name: string, movieID?: Types.ObjectId | null }
   * @returns created document or array of documents
   */
  async create(doc: CreateActor | CreateActor[]) {
    return this.ActorModel.create(doc);
  }

  /**
   * Mongoose Model.findOne(): gets a single document that matches filter
   * @param filter fields to search by
   * @param projection fields to include or exclude
   * @param options query options - see https://mongoosejs.com/docs/api/query.html#query_Query-setOptions
   * @returns a single document, or null if none is found
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
   * Mongoose Model.find(): gets a list of documents that match filter
   * @param filter fields to search by
   * @param projection fields to include or exclude
   * @param options query options - see https://mongoosejs.com/docs/api/query.html#query_Query-setOptions
   * @returns a single document, array of documents, or null if none is found
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
   * @param options update options - see https://mongoosejs.com/docs/api/query.html#query_Query-setOptions
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
   * Mongoose Model.findByIdAndDelete(): delete document by the given _id
   * @param id _id of document to delete
   */
  async delete(params: { id: string }) {
    const { id } = params;
    return this.ActorModel.findByIdAndDelete(id).exec();
  }
}
