import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class Rating {
  @Prop()
  source: string;

  @Prop()
  score: string;
}

export type RatingDocument = mongoose.HydratedDocument<Rating>;

export const RatingSchema = SchemaFactory.createForClass(Rating);
