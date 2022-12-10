
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface GenreInput {
    name: string;
}

export interface StarInput {
    name: string;
}

export interface CreateMovieInput {
    imDbID?: Nullable<string>;
    image?: Nullable<string>;
    title: string;
    description?: Nullable<string>;
    runtimeStr?: Nullable<string>;
    genres: Nullable<GenreInput>[];
    contentRating?: Nullable<string>;
    imDbRating?: Nullable<string>;
    imDbRatingVotes?: Nullable<string>;
    metacriticRating?: Nullable<string>;
    plot?: Nullable<string>;
    stars: Nullable<StarInput>[];
}

export interface UpdateMovieInput {
    id: string;
    imDbID?: Nullable<string>;
    image?: Nullable<string>;
    title?: Nullable<string>;
    description?: Nullable<string>;
    runtimeStr?: Nullable<string>;
    genres?: Nullable<Nullable<GenreInput>[]>;
    contentRating?: Nullable<string>;
    imDbRating?: Nullable<string>;
    imDbRatingVotes?: Nullable<string>;
    metacriticRating?: Nullable<string>;
    plot?: Nullable<string>;
    stars?: Nullable<Nullable<StarInput>[]>;
}

export interface Genre {
    name: string;
}

export interface Star {
    name: string;
}

export interface Movie {
    id: string;
    imDbID?: Nullable<string>;
    image?: Nullable<string>;
    title: string;
    description?: Nullable<string>;
    runtimeStr?: Nullable<string>;
    genres: Nullable<Genre>[];
    contentRating?: Nullable<string>;
    imDbRating?: Nullable<string>;
    imDbRatingVotes?: Nullable<string>;
    metacriticRating?: Nullable<string>;
    plot?: Nullable<string>;
    stars: Nullable<Star>[];
}

export interface IQuery {
    movies(): Nullable<Movie>[] | Promise<Nullable<Movie>[]>;
    movie(id: string): Nullable<Movie> | Promise<Nullable<Movie>>;
}

export interface IMutation {
    addMovies(movies: CreateMovieInput[]): Nullable<Movie>[] | Promise<Nullable<Movie>[]>;
    updateMovie(updateMovieInput: UpdateMovieInput): Movie | Promise<Movie>;
    removeMovie(id: string): Nullable<Movie> | Promise<Nullable<Movie>>;
}

export interface User {
    id: string;
    movies: Nullable<Movie>[];
}

type Nullable<T> = T | null;
