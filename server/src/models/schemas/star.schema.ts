import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

import { Movie } from './movie.schema';

@Schema()
export class Star {
  @Prop({
    required: true,
    unique: true,
  })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
  })
  movies: Movie[];
}

export type StarDocument = mongoose.HydratedDocument<Star>;

export const StarSchema = SchemaFactory.createForClass(Star);
