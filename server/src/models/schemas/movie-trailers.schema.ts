import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class MovieTrailers {
  @Prop()
  title: string;

  @Prop()
  trailers: string[];
}

export type MovieTrailersDocument = mongoose.HydratedDocument<MovieTrailers>;

export const MovieTrailersSchema = SchemaFactory.createForClass(MovieTrailers);
