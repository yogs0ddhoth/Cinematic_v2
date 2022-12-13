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
}

export type StarDocument = mongoose.HydratedDocument<Star>;

export const StarSchema = SchemaFactory.createForClass(Star);
