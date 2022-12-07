
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface GenreInput {
    key?: Nullable<string>;
    value?: Nullable<string>;
}

export interface StarInput {
    id?: Nullable<string>;
    name?: Nullable<string>;
}

export interface CreateMovieInput {
    imDbId: string;
    image?: Nullable<string>;
    title: string;
    description?: Nullable<string>;
    runtimeStr?: Nullable<string>;
    genres?: Nullable<string>;
    genreList?: Nullable<Nullable<GenreInput>[]>;
    contentRating?: Nullable<string>;
    imDbRating?: Nullable<string>;
    imDbRatingVotes?: Nullable<string>;
    metacriticRating?: Nullable<string>;
    plot?: Nullable<string>;
    stars?: Nullable<string>;
    starList?: Nullable<Nullable<StarInput>[]>;
}

export interface UpdateMovieInput {
    id: string;
    imDbId: string;
    image?: Nullable<string>;
    title: string;
    description?: Nullable<string>;
    runtimeStr?: Nullable<string>;
    genres?: Nullable<string>;
    genreList?: Nullable<Nullable<GenreInput>[]>;
    contentRating?: Nullable<string>;
    imDbRating?: Nullable<string>;
    imDbRatingVotes?: Nullable<string>;
    metacriticRating?: Nullable<string>;
    plot?: Nullable<string>;
    stars?: Nullable<string>;
    starList?: Nullable<Nullable<StarInput>[]>;
}

export interface Genre {
    key: string;
    value?: Nullable<string>;
}

export interface Star {
    id: string;
    name?: Nullable<string>;
}

export interface Movie {
    id: string;
    imDbId: string;
    image?: Nullable<string>;
    title: string;
    description?: Nullable<string>;
    runtimeStr?: Nullable<string>;
    genres?: Nullable<string>;
    genreList?: Nullable<Nullable<Genre>[]>;
    contentRating?: Nullable<string>;
    imDbRating?: Nullable<string>;
    imDbRatingVotes?: Nullable<string>;
    metacriticRating?: Nullable<string>;
    plot?: Nullable<string>;
    stars?: Nullable<string>;
    starList?: Nullable<Nullable<Star>[]>;
}

export interface IQuery {
    movies(): Nullable<Movie>[] | Promise<Nullable<Movie>[]>;
    movie(id: string): Nullable<Movie> | Promise<Nullable<Movie>>;
}

export interface IMutation {
    addMovies(movies?: Nullable<CreateMovieInput[]>): Nullable<Movie>[] | Promise<Nullable<Movie>[]>;
    updateMovie(updateMovieInput: UpdateMovieInput): Movie | Promise<Movie>;
    removeMovie(id: string): Nullable<Movie> | Promise<Nullable<Movie>>;
}

export interface User {
    id: string;
    movies?: Nullable<Nullable<Movie>[]>;
}

type Nullable<T> = T | null;
