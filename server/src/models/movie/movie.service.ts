import { Injectable } from '@nestjs/common';
import { Prisma, Movie } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class MovieService {
  constructor(private readonly prisma: PrismaService) {}

  /** NOTE: include and select cannot both be included on the same query */
  async create(params: {
    data: Prisma.MovieCreateInput;
    include?: Prisma.MovieInclude;
    select?: Prisma.MovieSelect;
  }) {
    const { data, include, select } = params;

    if (include) {
      return this.prisma.movie.create({ data, include });
    }
    if (select) {
      return this.prisma.movie.create({ data, select });
    }
    return this.prisma.movie.create({ data });
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
    return this.prisma.movie.findMany(params);
  }
  /**
   * @param where  id?: string
   */
  async findOne(params: {
    where: Prisma.MovieWhereUniqueInput;
    include?: Prisma.MovieInclude;
  }): Promise<Movie | null> {
    return this.prisma.movie.findUnique(params);
  }
  async findMany(params: {
    orderBy?: Prisma.MovieOrderByWithAggregationInput;
    where: Prisma.MovieWhereInput;
  }): Promise<Movie[]> {
    return this.prisma.movie.findMany(params);
  }

  /**
   * @param params.where  id?: string
   */
  async update(params: {
    where: Prisma.MovieWhereUniqueInput;
    data: Prisma.MovieUpdateInput;
    include?: Prisma.MovieInclude;
    select?: Prisma.MovieSelect;
  }) {
    const { where, data, include, select } = params;

    if (include)
      return this.prisma.movie.update({
        where,
        data,
        include,
      });

    if (select)
      return this.prisma.movie.update({
        where,
        data,
        select,
      });

    return this.prisma.movie.update({ where, data });
  }

  /** NOTE: include and select cannot both be included on the same query */
  async upsert(params: {
    create: Prisma.MovieCreateInput;
    update: Prisma.MovieUpdateInput;
    where: Prisma.MovieWhereUniqueInput;
    include?: Prisma.MovieInclude;
    select?: Prisma.MovieSelect;
  }) {
    const { create, update, where, include, select } = params;

    if (include)
      return this.prisma.movie.upsert({
        create,
        update,
        where,
        include,
      });

    if (select)
      return this.prisma.movie.upsert({
        create,
        update,
        where,
        select,
      });

    return this.prisma.movie.upsert({
      create,
      update,
      where,
    });
  }

  async remove() {
    return;
  }
}
