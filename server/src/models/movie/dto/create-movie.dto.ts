import { Types } from 'mongoose';

export class CreateMovie {
  readonly imDbID?: string | null;
  readonly image?: string | null;
  readonly title: string;
  readonly description?: string | null;
  readonly runtimeStr?: string | null;
  readonly contentRating?: string | null;
  readonly imDbRating?: string | null;
  readonly imDbRatingVotes?: string | null;
  readonly metacriticRating?: string | null;
  readonly plot?: string | null;

  readonly genres?: Types.ObjectId[] | null;
  readonly stars?: Types.ObjectId[] | null;
}
