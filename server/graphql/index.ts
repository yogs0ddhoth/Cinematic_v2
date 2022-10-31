import { arg, intArg, list, nonNull, objectType, stringArg } from 'nexus';
import { testMovie } from '../movie';
import { Movie } from './movie';
import { MovieInput } from './movieInput';
export * from './movie';

import { NexusGenInputs } from '../schema/nexus-typegen';
function serializeMovieData({ id, genreList, starList, ...movieData }: NexusGenInputs['MovieInput']) {
  return {
    ...movieData,
    imDbId: id,
    genreList: {
      createMany: {
        data: genreList,
      },
    },
    starList: {
      createMany: {
        data: starList,
      },
    },
  };
}

export const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.list.field("addMovies", {
      type: Movie,
      args: {
        movies: arg({ type: nonNull(list(nonNull(MovieInput))) }),
      },
      async resolve(_, { movies }, { prisma }) {
        return await Promise.all(
          movies.map(
            async (movie) => {
              return await prisma.movie.create({
                data: serializeMovieData(movie),
                include: {
                  genreList: true,
                  starList: true,
                },
              });
            }
          )
        );
      },
    });

    // t.nonNull.list.field('searchMovies', {
    //   type: Movie,
    //   args: { // IMDb Advanced Search Params - optional
    //     title: stringArg(),
    //     title_type: stringArg(),
    //     release_date: intArg(),
    //     user_rating: intArg(), // corresponds to 'imDbRating'
    //     genres: stringArg(),
    //     certificates: stringArg(), // corresponds to 'contentRating' 
    //   },
    //   async resolve(_, args, { imdb }) {
    //     console.log("IMDB CALL")
    //     const { data } = await imdb.get('/', {
    //       params: {
    //         ...args
    //       },
    //     });
    //     return data.results;
    //   },
    // });
  },
});

export const Query = objectType({
  name: 'Query',
  definition(t) {
    t.nonNull.list.field('getMovies', {
      type: Movie,
      async resolve(_, __, { prisma }) {
        console.log('API CALL');
        return await prisma.movie.findMany({
          include: {
            genreList: true,
            starList: true,
          },
        });
      },
    });

    t.nonNull.list.field('searchMovies', {
      type: Movie,
      args: { // IMDb Advanced Search Params - optional
        title: stringArg(),
        title_type: stringArg(),
        release_date: intArg(),
        user_rating: intArg(), // corresponds to 'imDbRating'
        genres: stringArg(),
        certificates: stringArg(), // corresponds to 'contentRating' 
      },
      async resolve(_, args, { imdb }) {
        console.log("IMDB CALL")
        const { data } = await imdb.get('/', {
          params: {
            ...args
          },
        });
        return data.results;
      },
    });
  },
});
