import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class Actor {
  @Prop({
    required: true,
    unique: true,
  })
  name: string;
}

export type ActorDocument = mongoose.HydratedDocument<Actor>;

export const ActorSchema = SchemaFactory.createForClass(Actor);
