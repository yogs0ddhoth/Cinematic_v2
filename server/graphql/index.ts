import { arg, nonNull, objectType } from 'nexus';
import { testMovie } from '../movie';
import { Movie } from './movie';
import { MovieInput } from './movieInput';
export * from './movie';

import { PrismaClient } from "@prisma/client";
import { testMovieInput } from "../movie";

const prisma = new PrismaClient();

export const Mutation = objectType({
  name: "Mutation",
  definition(t) {
    t.field("addMovie", {
      type: Movie,
      args: {
        movie: arg({ type: nonNull(MovieInput) }),
      },
      async resolve(_, {movie}, {prisma}) {
        const {id, genreList, starList, ...data} = movie;
        const newMovie = await prisma.movie.create({
          data: {
            ...data,
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
          }
        });

        console.log(newMovie);
        return newMovie;
      }
    })
  }
});
export const Query = objectType({
  name: "Query",
  definition(t) {
    t.nonNull.list.field("movie", { 
        type: Movie,
        async resolve(_, __, {prisma}) {
            return await prisma.movie.findMany({
              include: {
                genreList: true,
                starList: true
              }
            })
        }
    })
    
  }
});