import { Types } from 'mongoose';

export class CreateDirector {
  readonly name: string;

  readonly movieID?: Types.ObjectId | null;
}
