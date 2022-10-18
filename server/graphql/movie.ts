import { arg, objectType } from 'nexus';
import { testMovie } from '../movie';

export const Genre = objectType({
  name: "Genre",
  definition(t) {
    t.nonNull.string("key")
    t.string("value")
  }
});
export const Star = objectType({
  name: "Star",
  definition(t) {
    t.nonNull.string("id")
    t.string("name")
  }
});
export const Movie = objectType({
  name: "Movie",
  definition(t) {
    t.nonNull.string("id")
    t.string("image")
    t.nonNull.string("title")
    t.string("description")
    t.nonNull.string("runtimeStr")
    t.string("genres")
    t.list.field("genreList", { type: Genre })
    t.string("contentRating")
    t.float("imDbRating")
    t.int("imDbRatingVotes")
    t.int("metacriticRating")
    t.string("plot")
    t.string("stars")
    t.list.field("starList", { type: Star })
  }
});

export const Query = objectType({
  name: "Query",
  definition(t) {
    t.nonNull.list.field("movies", { 
      type: Movie,
      resolve(_, args, context, info) {
        return [testMovie];
      }
    })
  }
});

const Mutation = objectType({
  name: "Mutation",
  definition(t) {
    t.field("saveMovie", {
      type: Movie,
      args: {
        movie: arg({ type: 'Movie' }),
      },
      resolve(_, args, context) {
        return testMovie;
      }
    })
  }
});