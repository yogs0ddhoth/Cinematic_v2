import { Injectable } from '@angular/core';
import {Apollo, ApolloBase, gql} from 'apollo-angular';
import { Observable } from 'rxjs';

export interface Movie {
  contentRating?: string | null;
  description?: string | null;
  genreList?: {
    key: string;
    value?: string | null;
  }[]
  genres?: string | null;
  id: string;
  imDbId?: string | null;
  imDbRating?: number | null;
  imDbRatingVotes?: number | null;
  image?: string | null;
  metacriticRating?: number | null;
  plot?: string | null;
  runtimeStr?: string | null;
  starList?: {
    id: string;
    name?: string | null;
  }[]
  stars?: string | null;
  title: string;
}
interface Response {
  getMovies: (Movie|null)[]
}

const GET_MOVIES = gql`
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
`;

interface ImDbResponse { searchMovies: (Movie|null)[] }
const SEARCH_MOVIES = gql`
  query SearchMovies($certificates: String, $genres: String, $releaseDate: Int, $title: String, $titleType: String, $userRating: Int) {
    searchMovies(certificates: $certificates, genres: $genres, release_date: $releaseDate, title: $title, title_type: $titleType, user_rating: $userRating) {
      id
      contentRating
      description
      genreList {
        value
        key
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
        id
      }
      stars
      title
      imDbId
    }
  }
`;

interface imDbParams {
  certificates?: String, 
  genres?: String, 
  releaseDate?: number, 
  title?: String, 
  titleType?: String, 
  userRating?: number
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // apollo: ApolloClient;

  constructor(private apolloProvider: Apollo) {
    // this.apollo = this.apolloProvider.client;
  }

  /**
   * Get all movies saved on the server
   * @returns Observable containing the Apollo QueryRef
   */
  getMovies() {
    return this.apolloProvider.watchQuery<Response>({
      query: GET_MOVIES
    });
  }
  /**
   *  return cached Movie searches
   * @returns (getMovies: (Movie|null)[] ) | null
   */
  readMovieCache() {
    return this.apolloProvider.client.readQuery<Response>({
      query: GET_MOVIES
    })
  }

  /**
   * Call the ImDb API from the server
   * @param config: imDbParams { certificates?: String, genres?: String, releaseDate?: number, title?: String, titleType?: String, userRating?: number }
   * @returns Observable containing the Apollo MutationResult
   */
  searchImDb(config: imDbParams) {
    return this.apolloProvider.query<ImDbResponse>({
      query: SEARCH_MOVIES,
      variables: config
    });
  }
    /**
   * return cached imDb searches
   * @param config: variables { certificates?: String, genres?: String, releaseDate?: number, title?: String, titleType?: String, userRating?: number }
   * @returns (searchMovies: (Movie|null)[]) | null
   */
  readImDbCache(config: imDbParams) {
    return this.apolloProvider.client.readQuery({
      query: SEARCH_MOVIES,
      variables: config
    });
  }
}
