import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

import { Movie } from './movie.schema';

@Schema()
export class User {
  @Prop({
    required: true,
    unique: true,
  })
  _id: string;

  @Prop({
    required: true,
    unique: true,
  })
  username: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
  })
  movies: Movie[];
}

export type UserDocument = mongoose.HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);
