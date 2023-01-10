import { Types } from 'mongoose';

export class CreateWriter {
  readonly name: string;

  readonly movieID?: Types.ObjectId | null;
}
