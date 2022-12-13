import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ProjectionType, QueryOptions, UpdateQuery } from 'mongoose';

import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<UserDocument>,
  ) {}

  async create(doc: UserDocument) {
    return this.UserModel.create(doc);
  }

  async get(params: {
    id: string;
    projection?: ProjectionType<UserDocument>;
    options?: QueryOptions<UserDocument>;
  }) {
    const { id, projection, options } = params;
    return this.UserModel.findById(id, projection, options).exec();
  }

  async update(params: {
    id: string;
    update: UpdateQuery<UserDocument>;
    options?: QueryOptions<UserDocument>;
  }) {
    const { id, update, options } = params;
    return this.UserModel.findByIdAndUpdate(id, update, options).exec();
  }

  async delete(params: { id: string }) {
    const { id } = params;
    return this.UserModel.findByIdAndDelete(id).exec();
  }
}
