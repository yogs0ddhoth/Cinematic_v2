import { gql } from 'apollo-angular';
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
  title: Scalars['String'];
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
