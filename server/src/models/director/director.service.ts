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

@Injectable()
export class DirectorService {
  constructor(
    @InjectModel(Director.name)
    private readonly DirectorModel: Model<DirectorDocument>,
  ) {}

  /**
   * create a new Director document or array of documents
   * @param {CreateDirector} doc document/documents to be created
   * @type {CreateDirector} { name: string, movieID?: Types.ObjectId | null }
   * @returns created document or documents
   */
  async create(doc: CreateDirector | CreateDirector[]) {
    return this.DirectorModel.create(doc);
  }

  async get(params: {
    filter: FilterQuery<DirectorDocument>;
    projection?: ProjectionType<DirectorDocument>;
    options?: QueryOptions<DirectorDocument>;
  }) {
    const { filter, projection, options } = params;
    return this.DirectorModel.findOne(filter, projection, options).exec();
  }

  /**
   * Mongoose Model.findOneAndUpdate(): atomically find the first document that matches filter and apply update
   * @param filter fields to search by
   * @param update field update(s)
   * @param options update options - see docs
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

  async delete(params: { id: string }) {
    const { id } = params;
    return this.DirectorModel.findByIdAndDelete(id).exec();
  }
}
