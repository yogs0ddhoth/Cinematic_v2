import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from './prisma/prisma.service';

/** TODO: Integrate JWT Auth with User */
@Injectable()
export default class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findUser(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({where: userWhereUniqueInput});
  }

  createUser() {}
}