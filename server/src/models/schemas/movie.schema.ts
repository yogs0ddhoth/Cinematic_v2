import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Schema as MongooseSchema,
  HydratedDocument as MongooseHydratedDocument,
} from 'mongoose';

import { Genre } from './genre.schema';
import { Actor } from './actor.schema';
import { Rating, RatingSchema } from './rating.schema';

@Schema()
export class Movie {
  @Prop({ unique: true })
  imDbID: string;

  @Prop()
  title: string;

  @Prop()
  year: string;

  @Prop()
  released: string;

  @Prop()
  contentRating: string;

  @Prop()
  runtime: string;

  @Prop()
  director: string;

  @Prop()
  writer: string;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId }],
    ref: 'Actor',
  })
  actors: Actor[];

  @Prop()
  plot: string;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId }],
    ref: 'Genre',
  })
  genres: Genre[];

  @Prop()
  language: string;

  @Prop()
  country: string;

  @Prop()
  awards: string;

  @Prop()
  image: string;

  @Prop({
    type: [RatingSchema],
  })
  ratings: Rating[];

  @Prop()
  imdbVotes: string;

  @Prop()
  boxOffice: string;

  @Prop()
  production: string;
}

export type MovieDocument = MongooseHydratedDocument<Movie>;

export const MovieSchema = SchemaFactory.createForClass(Movie);
