
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface GenreInput {
    key: string;
    value: string;
}

export interface StarInput {
    id: string;
    name: string;
}

export interface CreateMovieInput {
    contentRating?: Nullable<string>;
    description?: Nullable<string>;
    genreList: GenreInput[];
    genres?: Nullable<string>;
    id: string;
    imDbRating?: Nullable<number>;
    imDbRatingVotes?: Nullable<number>;
    image?: Nullable<string>;
    metacriticRating?: Nullable<number>;
    plot?: Nullable<string>;
    runtimeStr?: Nullable<string>;
    starList: StarInput[];
    stars?: Nullable<string>;
    title: string;
}

export interface UpdateMovieInput {
    contentRating?: Nullable<string>;
    description?: Nullable<string>;
    genreList?: Nullable<Nullable<GenreInput>[]>;
    genres?: Nullable<string>;
    id: string;
    imDbId?: Nullable<string>;
    imDbRating?: Nullable<number>;
    imDbRatingVotes?: Nullable<number>;
    image?: Nullable<string>;
    metacriticRating?: Nullable<number>;
    plot?: Nullable<string>;
    runtimeStr?: Nullable<string>;
    starList?: Nullable<Nullable<StarInput>[]>;
    stars?: Nullable<string>;
    title?: Nullable<string>;
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
    contentRating?: Nullable<string>;
    description?: Nullable<string>;
    genreList?: Nullable<Nullable<Genre>[]>;
    genres?: Nullable<string>;
    id: string;
    imDbId?: Nullable<string>;
    imDbRating?: Nullable<number>;
    imDbRatingVotes?: Nullable<number>;
    image?: Nullable<string>;
    metacriticRating?: Nullable<number>;
    plot?: Nullable<string>;
    runtimeStr?: Nullable<string>;
    starList?: Nullable<Nullable<Star>[]>;
    stars?: Nullable<string>;
    title: string;
}

export interface IQuery {
    movies(): Nullable<Movie>[] | Promise<Nullable<Movie>[]>;
    movie(id: string): Nullable<Movie> | Promise<Nullable<Movie>>;
}

export interface IMutation {
    addMovies(movies: CreateMovieInput[]): Nullable<Movie>[] | Promise<Nullable<Movie>[]>;
    createMovie(createMovieInput: CreateMovieInput): Movie | Promise<Movie>;
    updateMovie(updateMovieInput: UpdateMovieInput): Movie | Promise<Movie>;
    removeMovie(id: string): Nullable<Movie> | Promise<Nullable<Movie>>;
}

type Nullable<T> = T | null;
