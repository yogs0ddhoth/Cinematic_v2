import { Injectable } from '@angular/core';
import {Apollo, ApolloBase, gql} from 'apollo-angular';
import { Observable } from 'rxjs';

export interface Movie { // root type
  contentRating?: string | null; // String
  description?: string | null; // String
  genreList?: { // root type
    key: string; // String!
    value?: string | null; // String
  }[]
  genres?: string | null; // String
  id: string; // ID!
  imDbId?: string | null; // String
  imDbRating?: number | null; // Float
  imDbRatingVotes?: number | null; // Int
  image?: string | null; // String
  metacriticRating?: number | null; // Int
  plot?: string | null; // String
  runtimeStr?: string | null; // String
  starList?: { // root type
    id: string; // String!
    name?: string | null; // String
  }[]
  stars?: string | null; // String
  title: string; // String!
}
export interface Response {
  getMovies: (Movie|null)[]
}
export const TEST = gql<Response, null>`
query GetMovies {
  getMovies {
    id
    contentRating
    description
    genreList {
      value
    }
    genres
    imDbRating
    imDbRatingVotes
    image
    metacriticRating
    plot
    runtimeStr
    starList {
      name
    }
    stars
    title
    imDbId
  }
}
`
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // apollo: ApolloBase;

  constructor(private apolloProvider: Apollo) {
    // this.apollo = this.apolloProvider.use('Apollo');
  }

  getMovies() {
    return this.apolloProvider.watchQuery<Response>({
      query: TEST
    })
  }
}
