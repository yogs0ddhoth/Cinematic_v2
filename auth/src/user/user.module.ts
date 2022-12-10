import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  providers: [
    PrismaService,
    UserService,
    // UserResolver
  ],
  exports: [UserService],
})
export class UserModule {}
