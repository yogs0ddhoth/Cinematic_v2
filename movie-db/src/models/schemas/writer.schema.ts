import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

import { Movie } from './movie.schema';

@Schema()
export class Writer {
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

export type WriterDocument = mongoose.HydratedDocument<Writer>;

export const WriterSchema = SchemaFactory.createForClass(Writer);
