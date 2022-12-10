import { Injectable } from '@nestjs/common';
import { Prisma, Star } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export default class StarsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.StarCreateInput): Promise<Star> {
    return this.prisma.star.create({ data });
  }
  async createMany(
    data: Prisma.StarCreateManyInput[],
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.star.createMany({ data });
  }

  async findOne(where: Prisma.StarWhereUniqueInput): Promise<Star | null> {
    return this.prisma.star.findUnique({ where });
  }
  async findMany(params: {
    orderBy?: Prisma.StarOrderByWithRelationInput;
    where: Prisma.StarWhereInput;
  }): Promise<Star[]> {
    const { orderBy, where } = params;
    return this.prisma.star.findMany({ orderBy, where });
  }

  async update(params: {
    where: Prisma.StarWhereUniqueInput;
    data: Prisma.StarUpdateInput;
  }): Promise<Star> {
    const { where, data } = params;
    return this.prisma.star.update({ where, data });
  }
  async updateMany(params: {
    where: Prisma.StarWhereInput;
    data: Prisma.StarUncheckedUpdateManyInput;
  }): Promise<Prisma.BatchPayload> {
    const { where, data } = params;
    return this.prisma.star.updateMany({ where, data });
  }

  async upsert(params: {
    create: Prisma.StarCreateInput;
    update: Prisma.StarUpdateInput;
    where: Prisma.StarWhereUniqueInput;
  }): Promise<Star> {
    const { create, update, where } = params;
    return this.prisma.star.upsert({ create, update, where });
  }

  async remove(where: Prisma.StarWhereUniqueInput): Promise<Star> {
    return this.prisma.star.delete({ where });
  }
}
