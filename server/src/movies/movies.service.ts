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

  async findAll(): Promise<Movie[]> {
    return this.prisma.movie.findMany({
      include: {
        genreList: true,
        starList: true,
      },
    });
  }
  /**
   * @param where  id?: string
   */
  async findOne(where: Prisma.MovieWhereUniqueInput): Promise<Movie | null> {
    return this.prisma.movie.findUnique({ where });
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
  }): Promise<Movie> {
    const { where, data } = params;
    return this.prisma.movie.update({ where, data });
  }

  async remove() {
    return;
  }
}
