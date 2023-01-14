import { NgModule } from '@angular/core';

import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';

import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { ApolloLink } from '@apollo/client/link/core';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

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
      onError(({ graphQLErrors }) => {
        if (graphQLErrors) {
          graphQLErrors.forEach(({ message, extensions }) => {
            if (extensions?.['code'] === 'UNAUTHENTICATED') {
              console.log(message);
              localStorage.removeItem('token');
            }
          });
        }
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
