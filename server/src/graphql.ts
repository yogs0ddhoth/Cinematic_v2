
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

export interface ActorInput {
    name: string;
}

export interface RatingInput {
    source: string;
    score: string;
}

export interface CreateMovieInput {
    imdbID?: Nullable<string>;
    title: string;
    year?: Nullable<string>;
    released?: Nullable<string>;
    contentRating?: Nullable<string>;
    runtime?: Nullable<string>;
    director?: Nullable<string>;
    writer?: Nullable<string>;
    actors?: Nullable<ActorInput[]>;
    plot?: Nullable<string>;
    genres?: Nullable<GenreInput[]>;
    language?: Nullable<string>;
    country?: Nullable<string>;
    awards?: Nullable<string>;
    image?: Nullable<string>;
    ratings?: Nullable<RatingInput[]>;
    imdbVotes?: Nullable<string>;
    boxOffice?: Nullable<string>;
    production?: Nullable<string>;
}

export interface UpdateMovieInput {
    id: string;
    imdbID?: Nullable<string>;
    title?: Nullable<string>;
    year?: Nullable<string>;
    released?: Nullable<string>;
    contentRating?: Nullable<string>;
    runtime?: Nullable<string>;
    director?: Nullable<string>;
    writer?: Nullable<string>;
    actors?: Nullable<ActorInput[]>;
    plot?: Nullable<string>;
    genres?: Nullable<GenreInput[]>;
    language?: Nullable<string>;
    country?: Nullable<string>;
    awards?: Nullable<string>;
    image?: Nullable<string>;
    ratings?: Nullable<RatingInput[]>;
    imdbVotes?: Nullable<string>;
    boxOffice?: Nullable<string>;
    production?: Nullable<string>;
}

export interface Actor {
    name: string;
}

export interface Genre {
    name: string;
}

export interface Movie {
    id: string;
    imdbID?: Nullable<string>;
    title: string;
    year?: Nullable<string>;
    released?: Nullable<string>;
    contentRating?: Nullable<string>;
    runtime?: Nullable<string>;
    director?: Nullable<string>;
    writer?: Nullable<string>;
    actors?: Nullable<Actor[]>;
    plot?: Nullable<string>;
    genres?: Nullable<Genre[]>;
    language?: Nullable<string>;
    country?: Nullable<string>;
    awards?: Nullable<string>;
    image?: Nullable<string>;
    ratings?: Nullable<Rating[]>;
    imdbVotes?: Nullable<string>;
    boxOffice?: Nullable<string>;
    production?: Nullable<string>;
}

export interface Rating {
    source: string;
    score: string;
}

export interface IQuery {
    movies(): Nullable<User> | Promise<Nullable<User>>;
    movie(id: string): Movie | Promise<Movie>;
}

export interface IMutation {
    addMovies(movies: CreateMovieInput[]): Nullable<User> | Promise<Nullable<User>>;
    updateMovie(updateMovieInput: UpdateMovieInput): Movie | Promise<Movie>;
    removeMovie(id: string): Nullable<User> | Promise<Nullable<User>>;
}

export interface User {
    id: string;
    movies?: Nullable<Movie[]>;
}

type Nullable<T> = T | null;
