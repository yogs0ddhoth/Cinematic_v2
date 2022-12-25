export class CreateMovie {
  readonly imDbID?: string | null;

  readonly title: string;
  readonly year?: string | null;
  readonly released?: string | null;
  readonly contentRating?: string | null;
  readonly runtime?: string | null;

  readonly director?: string | null;
  readonly writer?: string | null;

  readonly plot?: string | null;

  readonly language?: string | null;
  readonly country?: string | null;
  readonly awards?: string | null;
  readonly image?: string | null;

  readonly ratings?: { source: string; score: string }[] | null;
  readonly imdbVotes?: string | null;

  readonly boxOffice?: string | null;
  readonly production?: string | null;
}
