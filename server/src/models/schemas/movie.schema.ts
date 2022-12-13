import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

import { Genre } from './genre.schema';
import { Star } from './star.schema';
import { User } from './user.schema';

@Schema()
export class Movie {
  @Prop({ unique: true })
  imDbID: string;

  @Prop()
  image: string;

  @Prop({ unique: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  runtimeStr: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Genre',
  })
  genres: Genre[];

  @Prop()
  contentRating: string;

  @Prop()
  imDbRating: string;

  @Prop()
  imDbRatingVotes: string;

  @Prop()
  metacriticRating: string;

  @Prop()
  plot: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Star',
  })
  stars: Star[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  users: User[];
}

export type MovieDocument = mongoose.HydratedDocument<Movie>;

export const MovieSchema = SchemaFactory.createForClass(Movie);
