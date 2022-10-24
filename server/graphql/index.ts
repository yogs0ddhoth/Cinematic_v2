import { arg, intArg, nonNull, objectType, stringArg } from 'nexus';
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
        movie: arg(
          { type: nonNull(MovieInput) }
        ),
      },
      async resolve(_, {movie}, {prisma}) {
        const {
          id, 
          genreList, starList,
          ...movieData
        } = movie;
        return await prisma.movie.create({
          data: {
            ...movieData,
            imDbId: id,
            genreList: {
              createMany: {
                data: genreList
              }
            },
            starList: {
              createMany: {
                data: starList
              }
            }
          },
          include: {
            genreList: true,
            starList: true
          },
        });
      }
    })
  }
});
export const Query = objectType({
  name: "Query",
  definition(t) {
    t.nonNull.list.field("getMovies", { 
      type: Movie,
      async resolve(_, __, {prisma}) {
        return await prisma.movie.findMany({
          include: {
            genreList: true,
            starList: true
          }
        });
      }
    })
    t.nonNull.list.field("searchMovies", { 
      type: Movie,
      args: {
        title: stringArg(),
        title_type: stringArg(),
        release_date: intArg(),
        user_rating: intArg(),
        genres: stringArg(),
        certificates: stringArg(),
      },
      resolve(_, args, {axios}) {
        
        return [testMovie]
      }
    })
  }
});