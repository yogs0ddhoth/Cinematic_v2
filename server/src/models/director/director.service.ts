import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  FilterQuery,
  Model,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';

import { Director, DirectorDocument } from '../schemas/director.schema';
import { CreateDirector } from './dto/create-director.dto';

/**
 * Class containing Mongoose CRUD methods for Director documents
 */
@Injectable()
export class DirectorService {
  constructor(
    @InjectModel(Director.name)
    private readonly DirectorModel: Model<DirectorDocument>,
  ) {}

  /**
   * Mongoose.Model.create(): create a new Director document or array of documents
   * @param doc CreateDirector | CreateDirector[] document/documents to be created
   * @type {CreateDirector} { name: string, movieID?: Types.ObjectId | null }
   * @returns created document or documents
   */
  async create(doc: CreateDirector | CreateDirector[]) {
    return this.DirectorModel.create(doc);
  }

  /**
   *Mongoose Model.findOne(): gets a single document that matches filter
   * @param filter fields to search by
   * @param projection fields to include or exclude
   * @param options query options - see https://mongoosejs.com/docs/api/query.html#query_Query-setOptions
   * @returns a single document, or null if none is found
   */
  async find(params: {
    filter: FilterQuery<DirectorDocument>;
    projection?: ProjectionType<DirectorDocument>;
    options?: QueryOptions<DirectorDocument>;
  }) {
    const { filter, projection, options } = params;
    return this.DirectorModel.findOne(filter, projection, options).exec();
  }

  /**
   * Mongoose Model.find(): gets a list of documents that match filter
   * @param filter fields to search by
   * @param projection fields to include or exclude
   * @param options query options - see https://mongoosejs.com/docs/api/query.html#query_Query-setOptions
   * @returns a single document, array of documents, or null if none is found
   */
  async get(params: {
    filter: FilterQuery<DirectorDocument>;
    projection?: ProjectionType<DirectorDocument>;
    options?: QueryOptions<DirectorDocument>;
  }) {
    const { filter, projection, options } = params;
    return this.DirectorModel.find(filter, projection, options).exec();
  }

  /**
   * Mongoose Model.findOneAndUpdate(): atomically find the first document that matches filter and apply update
   * @param filter fields to search by
   * @param update field update(s)
   * @param options update options - see https://mongoosejs.com/docs/api/query.html#query_Query-setOptions
   * @returns updated document, or null if none is found (and upsert = false)
   */
  async update(params: {
    filter: FilterQuery<DirectorDocument>;
    update: UpdateQuery<DirectorDocument>;
    options?: QueryOptions<DirectorDocument>;
  }) {
    const { filter, update, options } = params;
    return this.DirectorModel.findOneAndUpdate(filter, update, options).exec();
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
    return this.DirectorModel.findByIdAndDelete(id).exec();
  }
}
