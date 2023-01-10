import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

/**
 * Class containing Prisma CRUD operations for User model
 */
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * PrismaClient.user.findUnique: Find zero or one User that matches the filter.
   * @param where Prisma.UserWhereUniqueInput: search filters for User model
   * @type {Prisma.UserWhereUniqueInput} {
        id?: string | undefined;
        email?: string | undefined;
      }
   * @returns Promise: the found User, or null if none is found
   */
  async user(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findUnique({ where });
  }

  /**
   * PrismaClient.user.create: Create a User
   * @param data Prisma.UserCreateInput: the data needed to create a User
   * @type {Prisma.UserCreateInput} {
        id: string;
        email: string;
        password: string;
      }
   * @returns Promise: the created User
   */
  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  /**
   * PrismaClient.user.update: Update one User.
   * @param where Prisma.UserWhereUniqueInput: search filters for User model
   * @param data Prisma.UserUpdateInput: the User field updates to apply
   * @type {Prisma.UserWhereUniqueInput} {
        id?: string | undefined;
        email?: string | undefined;
      }
      @type {Prisma.UserUpdateInput} {
   * @returns Promise: the updated User
   */
  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  /**
   * PrismaClient.user.delete: Delete a User.
   * @param where Prisma.UserWhereUniqueInput: search filters for User model
   * @type {Prisma.UserWhereUniqueInput} {
        id?: string | undefined;
        email?: string | undefined;
      }
   * @returns Promise: the deleted User
   */
  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({ where });
  }
}
