import { NgModule } from '@angular/core';

import {ApolloClientOptions, InMemoryCache} from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';

import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import {HttpLink} from 'apollo-angular/http';
import { ApolloLink } from '@apollo/client/link/core';

const uri = 'http://localhost:4000/'; 
export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  return {
    link: ApolloLink.from([
      setContext((_operation, _context) => ({
        headers: {
          Accept: 'charset=utf-8'
        }
      })),
      setContext((_operation, _context) => {
        const token = localStorage.getItem('token');
        return {
          headers: {
            Authorization: token ? `Bearer ${token}` : ''
          }
        };
      }),
      httpLink.create({uri}),
    ]),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
