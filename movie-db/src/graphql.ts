
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface ActorInput {
    name: string;
}

export interface DirectorInput {
    name: string;
}

export interface GenreInput {
    name: string;
}

export interface RatingInput {
    source: string;
    score: string;
}

export interface TrailersInput {
    title: string;
    trailers?: Nullable<string[]>;
}

export interface WriterInput {
    name: string;
}

export interface CreateMovieInput {
    imdbID?: Nullable<string>;
    title: string;
    year?: Nullable<string>;
    released?: Nullable<string>;
    contentRating?: Nullable<string>;
    runtime?: Nullable<string>;
    director?: Nullable<DirectorInput>;
    writers?: Nullable<WriterInput[]>;
    actors?: Nullable<ActorInput[]>;
    plot?: Nullable<string>;
    genres?: Nullable<GenreInput[]>;
    language?: Nullable<string>;
    country?: Nullable<string>;
    awards?: Nullable<string>;
    image?: Nullable<string>;
    trailers?: Nullable<TrailersInput>;
    ratings?: Nullable<RatingInput[]>;
    imdbVotes?: Nullable<string>;
    boxOffice?: Nullable<string>;
    production?: Nullable<string>;
}

export interface Actor {
    name: string;
    movies?: Nullable<Movie[]>;
}

export interface Director {
    name: string;
    movies?: Nullable<Movie[]>;
}

export interface Genre {
    name: string;
    movies?: Nullable<Movie[]>;
}

export interface MovieTrailers {
    title: string;
    trailers?: Nullable<string[]>;
}

export interface Writer {
    name: string;
    movies?: Nullable<Movie[]>;
}

export interface Movie {
    imdbID?: Nullable<string>;
    title: string;
    year?: Nullable<string>;
    released?: Nullable<string>;
    contentRating?: Nullable<string>;
    runtime?: Nullable<string>;
    director?: Nullable<Director>;
    writers?: Nullable<Writer[]>;
    actors?: Nullable<Actor[]>;
    plot?: Nullable<string>;
    genres?: Nullable<Genre[]>;
    language?: Nullable<string>;
    country?: Nullable<string>;
    awards?: Nullable<string>;
    image?: Nullable<string>;
    trailers?: Nullable<MovieTrailers>;
    ratings?: Nullable<Rating[]>;
    imdbVotes?: Nullable<string>;
    boxOffice?: Nullable<string>;
    production?: Nullable<string>;
}

export interface User {
    id: string;
    movies?: Nullable<Movie[]>;
}

export interface Rating {
    source: string;
    score: string;
}

export interface IQuery {
    movies(): Nullable<Movie[]> | Promise<Nullable<Movie[]>>;
    userMovies(): Nullable<User> | Promise<Nullable<User>>;
    actors(actors: ActorInput[]): Nullable<Actor[]> | Promise<Nullable<Actor[]>>;
    directors(directors: DirectorInput[]): Nullable<Director[]> | Promise<Nullable<Director[]>>;
    genres(genres: GenreInput[]): Nullable<Genre[]> | Promise<Nullable<Genre[]>>;
    writers(writers: WriterInput[]): Nullable<Writer[]> | Promise<Nullable<Writer[]>>;
}

export interface IMutation {
    addMovies(movies: CreateMovieInput[]): Nullable<User> | Promise<Nullable<User>>;
    removeMovieFromUser(imdbID: string): Nullable<User> | Promise<Nullable<User>>;
}

type Nullable<T> = T | null;
