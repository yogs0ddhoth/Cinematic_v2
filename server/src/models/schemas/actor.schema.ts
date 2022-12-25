import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

import { Movie } from './movie.schema';

@Schema()
export class Actor {
  @Prop({
    required: true,
    unique: true,
  })
  name: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId }],
    ref: 'Movie',
  })
  movies: Movie[];
}

export type ActorDocument = mongoose.HydratedDocument<Actor>;

export const ActorSchema = SchemaFactory.createForClass(Actor);
