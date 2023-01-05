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

@Injectable()
export class WriterService {
  constructor(
    @InjectModel(Writer.name)
    private readonly WriterModel: Model<WriterDocument>,
  ) {}

  /**
   * create a new Writer document or array of documents
   * @param {CreateWriter} doc document/documents to be created
   * @type {CreateWriter}  name: string, movieID?: Types.ObjectId | null }
   * @returns created document or documents
   */
  async create(doc: CreateWriter | CreateWriter[]) {
    return this.WriterModel.create(doc);
  }

  async get(params: {
    filter: FilterQuery<WriterDocument>;
    projection?: ProjectionType<WriterDocument>;
    options?: QueryOptions<WriterDocument>;
  }) {
    const { filter, projection, options } = params;
    return this.WriterModel.findOne(filter, projection, options).exec();
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

  async delete(params: { id: string }) {
    const { id } = params;
    return this.WriterModel.findByIdAndDelete(id).exec();
  }
}
