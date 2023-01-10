import { Types } from 'mongoose';

export class CreateGenre {
  readonly name: string;

  readonly movieID?: Types.ObjectId | null;
}
