
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class GenreInput {
    key: string;
    value: string;
}

export class StarInput {
    id: string;
    name: string;
}

export class CreateMovieInput {
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

export class UpdateMovieInput {
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

export class Genre {
    key: string;
    value?: Nullable<string>;
}

export class Star {
    id: string;
    name?: Nullable<string>;
}

export class Movie {
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

export abstract class IQuery {
    abstract movies(): Nullable<Movie>[] | Promise<Nullable<Movie>[]>;

    abstract movie(id: string): Nullable<Movie> | Promise<Nullable<Movie>>;
}

export abstract class IMutation {
    abstract addMovies(movies: CreateMovieInput[]): Nullable<Movie>[] | Promise<Nullable<Movie>[]>;

    abstract createMovie(createMovieInput: CreateMovieInput): Movie | Promise<Movie>;

    abstract updateMovie(updateMovieInput: UpdateMovieInput): Movie | Promise<Movie>;

    abstract removeMovie(id: string): Nullable<Movie> | Promise<Nullable<Movie>>;
}

type Nullable<T> = T | null;
