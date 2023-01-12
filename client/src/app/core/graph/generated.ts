import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Actor = {
  __typename?: 'Actor';
  movies?: Maybe<Array<Movie>>;
  name: Scalars['String'];
};

export type ActorInput = {
  name: Scalars['String'];
};

export type Auth = {
  __typename?: 'Auth';
  access_token: Scalars['String'];
};

export type CreateMovieInput = {
  actors?: InputMaybe<Array<ActorInput>>;
  awards?: InputMaybe<Scalars['String']>;
  boxOffice?: InputMaybe<Scalars['String']>;
  contentRating?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  director?: InputMaybe<DirectorInput>;
  genres?: InputMaybe<Array<GenreInput>>;
  image?: InputMaybe<Scalars['String']>;
  imdbID?: InputMaybe<Scalars['String']>;
  imdbVotes?: InputMaybe<Scalars['String']>;
  language?: InputMaybe<Scalars['String']>;
  plot?: InputMaybe<Scalars['String']>;
  production?: InputMaybe<Scalars['String']>;
  ratings?: InputMaybe<Array<RatingInput>>;
  released?: InputMaybe<Scalars['String']>;
  runtime?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
  trailers?: InputMaybe<TrailersInput>;
  writers?: InputMaybe<Array<WriterInput>>;
  year?: InputMaybe<Scalars['String']>;
};

export type Director = {
  __typename?: 'Director';
  movies?: Maybe<Array<Movie>>;
  name: Scalars['String'];
};

export type DirectorInput = {
  name: Scalars['String'];
};

export type Genre = {
  __typename?: 'Genre';
  movies?: Maybe<Array<Movie>>;
  name: Scalars['String'];
};

export type GenreInput = {
  name: Scalars['String'];
};

export type Movie = {
  __typename?: 'Movie';
  actors?: Maybe<Array<Actor>>;
  awards?: Maybe<Scalars['String']>;
  boxOffice?: Maybe<Scalars['String']>;
  contentRating?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  director?: Maybe<Director>;
  genres?: Maybe<Array<Genre>>;
  image?: Maybe<Scalars['String']>;
  imdbID?: Maybe<Scalars['String']>;
  imdbVotes?: Maybe<Scalars['String']>;
  language?: Maybe<Scalars['String']>;
  plot?: Maybe<Scalars['String']>;
  production?: Maybe<Scalars['String']>;
  ratings?: Maybe<Array<Rating>>;
  released?: Maybe<Scalars['String']>;
  runtime?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  trailers?: Maybe<MovieTrailers>;
  writers?: Maybe<Array<Writer>>;
  year?: Maybe<Scalars['String']>;
};

export type MovieTrailers = {
  __typename?: 'MovieTrailers';
  title?: Maybe<Scalars['String']>;
  trailers?: Maybe<Array<Scalars['String']>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addMovies?: Maybe<User>;
  removeMovieFromUser?: Maybe<User>;
  signup: Auth;
};


export type MutationAddMoviesArgs = {
  movies: Array<CreateMovieInput>;
};


export type MutationRemoveMovieFromUserArgs = {
  imdbID: Scalars['String'];
};


export type MutationSignupArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  actors?: Maybe<Array<Actor>>;
  directors?: Maybe<Array<Director>>;
  genres?: Maybe<Array<Genre>>;
  login: Auth;
  movies?: Maybe<Array<Movie>>;
  searchMovies: Array<Movie>;
  userMovies?: Maybe<User>;
  writers?: Maybe<Array<Writer>>;
};


export type QueryActorsArgs = {
  actors: Array<ActorInput>;
};


export type QueryDirectorsArgs = {
  directors: Array<DirectorInput>;
};


export type QueryGenresArgs = {
  genres: Array<GenreInput>;
};


export type QueryLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type QuerySearchMoviesArgs = {
  searchMovieInput: SearchMovieInput;
};


export type QueryWritersArgs = {
  writers: Array<WriterInput>;
};

export type Rating = {
  __typename?: 'Rating';
  score: Scalars['String'];
  source: Scalars['String'];
};

export type RatingInput = {
  score: Scalars['String'];
  source: Scalars['String'];
};

export type SearchMovieInput = {
  contentRating?: InputMaybe<Array<Scalars['String']>>;
  director?: InputMaybe<Scalars['String']>;
  genres?: InputMaybe<Array<Scalars['String']>>;
  pages?: InputMaybe<Scalars['Int']>;
  ratings?: InputMaybe<Array<SearchRatingInput>>;
  releaseYear?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
  writers?: InputMaybe<Array<Scalars['String']>>;
};

export type SearchRatingInput = {
  score: Scalars['Float'];
  source: Scalars['String'];
};

export type TrailersInput = {
  title: Scalars['String'];
  trailers?: InputMaybe<Array<Scalars['String']>>;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String'];
  id: Scalars['String'];
  movies?: Maybe<Array<Movie>>;
};

export type Writer = {
  __typename?: 'Writer';
  movies?: Maybe<Array<Movie>>;
  name: Scalars['String'];
};

export type WriterInput = {
  name: Scalars['String'];
};

export type AddMoviesMutationVariables = Exact<{
  movies: Array<CreateMovieInput> | CreateMovieInput;
}>;


export type AddMoviesMutation = { __typename?: 'Mutation', addMovies?: { __typename?: 'User', email: string, movies?: Array<{ __typename?: 'Movie', imdbID?: string | null, title: string, year?: string | null, released?: string | null, contentRating?: string | null, runtime?: string | null, plot?: string | null, language?: string | null, country?: string | null, awards?: string | null, image?: string | null, imdbVotes?: string | null, boxOffice?: string | null, production?: string | null, director?: { __typename?: 'Director', name: string } | null, writers?: Array<{ __typename?: 'Writer', name: string }> | null, actors?: Array<{ __typename?: 'Actor', name: string }> | null, genres?: Array<{ __typename?: 'Genre', name: string }> | null, trailers?: { __typename?: 'MovieTrailers', trailers?: Array<string> | null } | null, ratings?: Array<{ __typename?: 'Rating', source: string, score: string }> | null }> | null } | null };

export type RemoveMovieFromUserMutationVariables = Exact<{
  imdbId: Scalars['String'];
}>;


export type RemoveMovieFromUserMutation = { __typename?: 'Mutation', removeMovieFromUser?: { __typename?: 'User', email: string, movies?: Array<{ __typename?: 'Movie', imdbID?: string | null, title: string, year?: string | null, released?: string | null, contentRating?: string | null, runtime?: string | null, plot?: string | null, language?: string | null, country?: string | null, awards?: string | null, image?: string | null, imdbVotes?: string | null, boxOffice?: string | null, production?: string | null, director?: { __typename?: 'Director', name: string } | null, writers?: Array<{ __typename?: 'Writer', name: string }> | null, actors?: Array<{ __typename?: 'Actor', name: string }> | null, genres?: Array<{ __typename?: 'Genre', name: string }> | null, trailers?: { __typename?: 'MovieTrailers', trailers?: Array<string> | null } | null, ratings?: Array<{ __typename?: 'Rating', source: string, score: string }> | null }> | null } | null };

export type SignupMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type SignupMutation = { __typename?: 'Mutation', signup: { __typename?: 'Auth', access_token: string } };

export type LoginQueryVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginQuery = { __typename?: 'Query', login: { __typename?: 'Auth', access_token: string } };

export type SearchMoviesQueryVariables = Exact<{
  searchMovieInput: SearchMovieInput;
}>;


export type SearchMoviesQuery = { __typename?: 'Query', searchMovies: Array<{ __typename?: 'Movie', imdbID?: string | null, title: string, year?: string | null, released?: string | null, contentRating?: string | null, runtime?: string | null, plot?: string | null, language?: string | null, country?: string | null, awards?: string | null, image?: string | null, imdbVotes?: string | null, boxOffice?: string | null, production?: string | null, director?: { __typename?: 'Director', name: string } | null, writers?: Array<{ __typename?: 'Writer', name: string }> | null, actors?: Array<{ __typename?: 'Actor', name: string }> | null, genres?: Array<{ __typename?: 'Genre', name: string }> | null, trailers?: { __typename?: 'MovieTrailers', trailers?: Array<string> | null } | null, ratings?: Array<{ __typename?: 'Rating', source: string, score: string }> | null }> };

export type UserMoviesQueryVariables = Exact<{ [key: string]: never; }>;


export type UserMoviesQuery = { __typename?: 'Query', userMovies?: { __typename?: 'User', email: string, movies?: Array<{ __typename?: 'Movie', imdbID?: string | null, title: string, year?: string | null, released?: string | null, contentRating?: string | null, runtime?: string | null, plot?: string | null, language?: string | null, country?: string | null, awards?: string | null, image?: string | null, imdbVotes?: string | null, boxOffice?: string | null, production?: string | null, director?: { __typename?: 'Director', name: string } | null, writers?: Array<{ __typename?: 'Writer', name: string }> | null, actors?: Array<{ __typename?: 'Actor', name: string }> | null, genres?: Array<{ __typename?: 'Genre', name: string }> | null, trailers?: { __typename?: 'MovieTrailers', trailers?: Array<string> | null } | null, ratings?: Array<{ __typename?: 'Rating', source: string, score: string }> | null }> | null } | null };

export const AddMoviesDocument = gql`
    mutation AddMovies($movies: [CreateMovieInput!]!) {
  addMovies(movies: $movies) {
    email
    movies {
      imdbID
      title
      year
      released
      contentRating
      runtime
      director {
        name
      }
      writers {
        name
      }
      actors {
        name
      }
      plot
      genres {
        name
      }
      language
      country
      awards
      image
      trailers {
        trailers
      }
      ratings {
        source
        score
      }
      imdbVotes
      boxOffice
      production
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class AddMoviesGQL extends Apollo.Mutation<AddMoviesMutation, AddMoviesMutationVariables> {
    override document = AddMoviesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const RemoveMovieFromUserDocument = gql`
    mutation RemoveMovieFromUser($imdbId: String!) {
  removeMovieFromUser(imdbID: $imdbId) {
    email
    movies {
      imdbID
      title
      year
      released
      contentRating
      runtime
      director {
        name
      }
      writers {
        name
      }
      actors {
        name
      }
      plot
      genres {
        name
      }
      language
      country
      awards
      image
      trailers {
        trailers
      }
      ratings {
        source
        score
      }
      imdbVotes
      boxOffice
      production
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class RemoveMovieFromUserGQL extends Apollo.Mutation<RemoveMovieFromUserMutation, RemoveMovieFromUserMutationVariables> {
    override document = RemoveMovieFromUserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const SignupDocument = gql`
    mutation Signup($email: String!, $password: String!) {
  signup(email: $email, password: $password) {
    access_token
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class SignupGQL extends Apollo.Mutation<SignupMutation, SignupMutationVariables> {
    override document = SignupDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const LoginDocument = gql`
    query Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    access_token
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class LoginGQL extends Apollo.Query<LoginQuery, LoginQueryVariables> {
    override document = LoginDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const SearchMoviesDocument = gql`
    query SearchMovies($searchMovieInput: SearchMovieInput!) {
  searchMovies(searchMovieInput: $searchMovieInput) {
    imdbID
    title
    year
    released
    contentRating
    runtime
    director {
      name
    }
    writers {
      name
    }
    actors {
      name
    }
    plot
    genres {
      name
    }
    language
    country
    awards
    image
    trailers {
      trailers
    }
    ratings {
      source
      score
    }
    imdbVotes
    boxOffice
    production
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class SearchMoviesGQL extends Apollo.Query<SearchMoviesQuery, SearchMoviesQueryVariables> {
    override document = SearchMoviesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UserMoviesDocument = gql`
    query UserMovies {
  userMovies {
    email
    movies {
      imdbID
      title
      year
      released
      contentRating
      runtime
      director {
        name
      }
      writers {
        name
      }
      actors {
        name
      }
      plot
      genres {
        name
      }
      language
      country
      awards
      image
      trailers {
        trailers
      }
      ratings {
        source
        score
      }
      imdbVotes
      boxOffice
      production
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UserMoviesGQL extends Apollo.Query<UserMoviesQuery, UserMoviesQueryVariables> {
    override document = UserMoviesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }