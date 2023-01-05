import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

import { Genre } from './genre.schema';
import { Actor } from './actor.schema';
import { Rating, RatingSchema } from './rating.schema';
import { Director } from './director.schema';
import { Writer } from './writer.schema';
import { Trailers, TrailersSchema } from './trailers.schema';

@Schema()
export class Movie {
  @Prop({ unique: true })
  imdbID: string;

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

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId }],
    ref: 'Director',
  })
  director: Director;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId }],
    ref: 'Writer',
  })
  writers: Writer[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId }],
    ref: 'Actor',
  })
  actors: Actor[];

  @Prop()
  plot: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId }],
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
    type: TrailersSchema,
  })
  trailers: Trailers;

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

export type MovieDocument = mongoose.HydratedDocument<Movie>;

export const MovieSchema = SchemaFactory.createForClass(Movie);
