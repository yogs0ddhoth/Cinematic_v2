import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

import { UserAuthResolver } from './user-auth.resolver';
import { UserAuthService } from './user-auth.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { GraphQLError } from 'graphql';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
      },
      // remove sensitive and unnecessary information from the error message
      formatError: (error) => new GraphQLError(error.message),
    }),
    AuthModule,
    UserModule,
  ],
  providers: [UserAuthService, UserAuthResolver],
})
export class UserAuthModule {}
