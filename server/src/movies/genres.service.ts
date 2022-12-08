import { Injectable } from '@nestjs/common';
import { Prisma, Genre } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export default class GenresService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.GenreCreateInput): Promise<Genre> {
    return this.prisma.genre.create({ data });
  }
  async createMany(
    data: Prisma.GenreCreateManyInput[],
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.genre.createMany({ data });
  }

  async findOne(where: Prisma.GenreWhereUniqueInput): Promise<Genre | null> {
    return this.prisma.genre.findUnique({ where });
  }
  async findMany(params: {
    orderBy?: Prisma.GenreOrderByWithRelationInput;
    where: Prisma.GenreWhereInput;
  }): Promise<Genre[]> {
    const { orderBy, where } = params;
    return this.prisma.genre.findMany({ orderBy, where });
  }

  async update(params: {
    where: Prisma.GenreWhereUniqueInput;
    data: Prisma.GenreUpdateInput;
  }): Promise<Genre> {
    const { where, data } = params;
    return this.prisma.genre.update({ data, where });
  }
  async updateMany(params: {
    where: Prisma.GenreWhereInput;
    data: Prisma.GenreUncheckedUpdateManyInput;
  }): Promise<Prisma.BatchPayload> {
    const { where, data } = params;
    return this.prisma.genre.updateMany({ where, data });
  }

  async remove(where: Prisma.GenreWhereUniqueInput): Promise<Genre> {
    return this.prisma.genre.delete({ where });
  }
}
