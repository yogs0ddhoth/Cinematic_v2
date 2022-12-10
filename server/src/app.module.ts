import { Module } from '@nestjs/common';

import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';

import { join } from 'path';

import { AppController } from './app.resolver';
import { AppService } from './app.service';
// import { MoviesModule } from './movies/movies.module';
// import { ClientsModule, Transport } from '@nestjs/microservices';
import { ModelsModule } from './models/models.module';

@Module({
  imports: [
    // ClientsModule.register([{ name: 'IMDB_API', transport: Transport.TCP }]),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
      },
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    // MoviesModule,
    ModelsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
