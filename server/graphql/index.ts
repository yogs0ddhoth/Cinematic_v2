import { arg, nonNull, objectType } from 'nexus';
import { testMovie } from '../movie';
import { Movie } from './movie';
import { MovieInput } from './movieInput';
export * from './movie';

export const Mutation = objectType({
  name: "Mutation",
  definition(t) {
    t.field("addMovie", {
      type: Movie,
      args: {
        movie: arg({ type: nonNull(MovieInput) }),
      },
      resolve(_, {movie}) {
        return testMovie;
      }
    })
  }
});
export const Query = objectType({
  name: "Query",
  definition(t) {
    t.nonNull.list.field("movie", { 
        type: Movie,
        resolve() {
            return [testMovie];
        }
    })
    
  }
});