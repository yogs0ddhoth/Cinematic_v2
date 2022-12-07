import { Injectable } from '@nestjs/common';
import { Prisma, Genre } from '@prisma/client';
import { PrismaService } from './prisma/prisma.service';

/** TODO: Integrate JWT Auth with User */
@Injectable()
export default class GenresService {
  constructor(private readonly prisma: PrismaService) {}

  async findGenre(
    genreWhereUniqueInput: Prisma.GenreWhereUniqueInput,
  ): Promise<Genre | null> {
    return this.prisma.genre.findUnique({where: genreWhereUniqueInput});
  }

  createGenre() {}
  createGenres() {}
}