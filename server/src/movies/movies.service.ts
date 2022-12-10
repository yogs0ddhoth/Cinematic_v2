import { Injectable } from '@nestjs/common';
import { Prisma, Movie } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MoviesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(params: {
    data: Prisma.MovieCreateInput;
    include?: Prisma.MovieInclude;
  }): Promise<Movie> {
    const { data, include } = params;
    return this.prisma.movie.create({ data, include });
  }

  async createMany(
    data: Prisma.MovieCreateManyInput[],
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.movie.createMany({ data });
  }

  async findAll(params: {
    orderBy?: Prisma.MovieOrderByWithAggregationInput;
    include?: Prisma.MovieInclude;
  }): Promise<Movie[]> {
    const { orderBy, include } = params;
    return this.prisma.movie.findMany({ orderBy, include });
  }
  /**
   * @param where  id?: string
   */
  async findOne(params: {
    where: Prisma.MovieWhereUniqueInput;
    include?: Prisma.MovieInclude;
  }): Promise<Movie | null> {
    const { where, include } = params;
    return this.prisma.movie.findUnique({ where, include });
  }
  async findMany(params: {
    orderBy?: Prisma.MovieOrderByWithAggregationInput;
    where: Prisma.MovieWhereInput;
  }): Promise<Movie[]> {
    const { orderBy, where } = params;
    return this.prisma.movie.findMany({ orderBy, where });
  }

  /**
   * @param params.where  id?: string
   */
  async update(params: {
    where: Prisma.MovieWhereUniqueInput;
    data: Prisma.MovieUpdateInput;
    include?: Prisma.MovieInclude;
  }): Promise<Movie> {
    const { where, data, include } = params;
    return this.prisma.movie.update({ where, data, include });
  }
  
  async upsert(params: {
    create: Prisma.MovieCreateInput;
    update: Prisma.MovieUpdateInput;
    where: Prisma.MovieWhereUniqueInput;
  }): Promise<Movie> {
    const { create, update, where } = params;
    return this.prisma.movie.upsert({ create, update, where });
  }

  async remove() {
    return;
  }
}
