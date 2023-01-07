import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  FilterQuery,
  Model,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';

import { Writer, WriterDocument } from '../schemas/writer.schema';
import { CreateWriter } from './dto/create-writer.dto';

/**
 * Class containing Mongoose CRUD methods for interacting with the Writer collection
 */
@Injectable()
export class WriterService {
  constructor(
    @InjectModel(Writer.name)
    private readonly WriterModel: Model<WriterDocument>,
  ) {}

  /**
   * Mongoose.Model.create(): create a new Writer document or array of documents
   * @param {CreateWriter} doc document/documents to be created
   * @type {CreateWriter}  name: string, movieID?: Types.ObjectId | null }
   * @returns created document or array documents
   */
  async create(doc: CreateWriter | CreateWriter[]) {
    return this.WriterModel.create(doc);
  }

  /**
   * Mongoose Model.findOne(): gets a single document that matches filter
   * @param filter fields to search by
   * @param projection fields to return
   * @param options query options - see docs
   * @returns a single document, or null if none is found
   */
  async find(params: {
    filter: FilterQuery<WriterDocument>;
    projection?: ProjectionType<WriterDocument>;
    options?: QueryOptions<WriterDocument>;
  }) {
    const { filter, projection, options } = params;
    return this.WriterModel.findOne(filter, projection, options).exec();
  }

  /**
   * Mongoose Model.find(): gets a list of documents that match filter
   * @param filter fields to search by
   * @param projection fields to return
   * @param options query options - see docs
   * @returns a single document, array of documents, or null if none is found
   */
  async get(params: {
    filter: FilterQuery<WriterDocument>;
    projection?: ProjectionType<WriterDocument>;
    options?: QueryOptions<WriterDocument>;
  }) {
    const { filter, projection, options } = params;
    return this.WriterModel.find(filter, projection, options).exec();
  }

  /**
   * Mongoose Model.findOneAndUpdate(): atomically find the first document that matches filter and apply update
   * @param filter fields to search by
   * @param update field update(s)
   * @param options update options - see docs
   * @returns updated document, or null if none is found (and upsert = false)
   */
  async update(params: {
    filter: FilterQuery<WriterDocument>;
    update: UpdateQuery<WriterDocument>;
    options?: QueryOptions<WriterDocument>;
  }) {
    const { filter, update, options } = params;
    return this.WriterModel.findOneAndUpdate(filter, update, options).exec();
  }

  /**
   * Mongoose Model.findByIdAndDelete(): atomically find the document by id and delete it
   * @param params { id: string }
   * @returns a document containing a boolean acknowledged as true if the operation ran with write concern or false if write concern was disabled, and deletedCount containing the number of deleted documents; or null if none is found
   */
  async delete(params: { id: string }) {
    const { id } = params;
    return this.WriterModel.findByIdAndDelete(id).exec();
  }
}
