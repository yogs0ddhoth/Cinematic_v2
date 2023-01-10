import { Types } from 'mongoose';

export class CreateActor {
  readonly name: string;

  readonly movieID?: Types.ObjectId | null;
}
