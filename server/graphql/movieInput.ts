import { inputObjectType } from 'nexus';

export const GenreInput = inputObjectType({
  name: "GenreInput",
  definition(t) {
    t.nonNull.string("key")
    t.nonNull.string("value")
  }
});
export const MovieInput = inputObjectType({
  name: "MovieInput",
  definition(t) {
    t.string("contentRating")
    t.string("description")
    t.nonNull.list.field("genreList", { type: GenreInput })
    t.string("genres")
    t.nonNull.string("id")
    t.float("imDbRating")
    t.int("imDbRatingVotes")
    t.string("image")
    t.int("metacriticRating")
    t.string("plot")
    t.nonNull.string("runtimeStr")
    t.nonNull.list.field("starList", { type: StarInput })
    t.string("stars")
    t.nonNull.string("title")
  }
});
export  const StarInput = inputObjectType({
  name: "StarInput",
  definition(t) {
    t.nonNull.string("id")
    t.nonNull.string("name")
  }
});