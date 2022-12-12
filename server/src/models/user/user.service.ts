import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(params: {
    data: Prisma.UserCreateInput;
    include?: Prisma.UserInclude;
  }) {
    return this.prisma.user.create(params);
  }

  async user(params: {
    where: Prisma.UserWhereUniqueInput;
    include?: Prisma.UserInclude;
  }) {
    return this.prisma.user.findUnique(params);
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
    include?: Prisma.UserInclude;
  }): Promise<User> {
    return this.prisma.user.update(params);
  }

  async upsertUser(params: {
    create: Prisma.UserCreateInput;
    update: Prisma.UserUpdateInput;
    where: Prisma.UserWhereUniqueInput;
    include?: Prisma.UserInclude;
    select?: Prisma.UserSelect;
  }) {
    const { create, update, where, include, select } = params;

    if (include)
      return this.prisma.user.upsert({ create, update, where, include });
    if (select)
      return this.prisma.user.upsert({ create, update, where, select });

    return this.prisma.user.upsert({ create, update, where });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({ where });
  }
}
