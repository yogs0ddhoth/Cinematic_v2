import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ProjectionType, QueryOptions, UpdateQuery } from 'mongoose';

import { User, UserDocument } from '../schemas/user.schema';
import { CreateUser } from './dto/create-user.dto';

/**
 * Class containing Mongoose CRUD methods for User documents
 */
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<UserDocument>,
  ) {}

  /**
   * Mongoose Model.create(): create a new User document or array of documents
   * @param doc - CreateUser | CreateUser[] document/documents to be created
   * @type {CreateUser} { _id: string, username: string }
   * @returns created document or documents
   */
  async create(doc: CreateUser) {
    return this.UserModel.create(doc);
  }

  /**
   * Mongoose.Model.findById(): finds a single document by its _id field. findById(id) is almost* equivalent to findOne({ _id: id }). If you want to query by a document's _id, use findById() instead of findOne().
   * @param id { string } the id of the document to find
   * @param projections fields to include or exclude
   * @param options query options - see https://mongoosejs.com/docs/api/query.html#query_Query-setOptions
   * @returns a single document, or null if none is found
   */
  async get(params: {
    id: string;
    projection?: ProjectionType<UserDocument>;
    options?: QueryOptions<UserDocument>;
  }) {
    const { id, projection, options } = params;
    return this.UserModel.findById(id, projection, options).exec();
  }

  /**
   * Mongoose Model.findByIdAndUpdate(): atomically find the document by id and apply update
   * @param id { string } the id of the document to update
   * @param update field update(s)
   * @param options update options - see https://mongoosejs.com/docs/api/query.html#query_Query-setOptions
   */
  async update(params: {
    id: string;
    update: UpdateQuery<UserDocument>;
    options?: QueryOptions<UserDocument>;
  }) {
    const { id, update, options } = params;
    return this.UserModel.findByIdAndUpdate(id, update, options).exec();
  }

  /**
   * Mongoose Model.findByIdAndDelete(): delete document by the given _id
   * @param id _id of document to delete
   */
  async delete(params: { id: string }) {
    const { id } = params;
    return this.UserModel.findByIdAndDelete(id).exec();
  }
}
