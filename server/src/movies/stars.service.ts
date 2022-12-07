import { Injectable } from '@nestjs/common';
import { Prisma, Star } from '@prisma/client';
import { PrismaService } from './prisma/prisma.service';

/** TODO: Integrate JWT Auth with User */
@Injectable()
export default class StarsService {
  constructor(private readonly prisma: PrismaService) {}

  async findStar(
    starWhereUniqueInput: Prisma.StarWhereUniqueInput,
  ): Promise<Star | null> {
    return this.prisma.star.findUnique({where: starWhereUniqueInput});
  }

  createStar() {}
  createStars() {}
}