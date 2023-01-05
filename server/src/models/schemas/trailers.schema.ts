import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class Trailers {
  @Prop()
  title: string;

  @Prop()
  trailers: string[];
}

export type TrailersDocument = mongoose.HydratedDocument<Trailers>;

export const TrailersSchema = SchemaFactory.createForClass(Trailers);
