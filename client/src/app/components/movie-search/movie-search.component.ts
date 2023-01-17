import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SearchMovieInput, SearchMoviesGQL, SearchMoviesQuery } from 'src/app/core/graph/generated';

@Component({
  selector: 'app-movie-search',
  templateUrl: './movie-search.component.html',
  styleUrls: ['./movie-search.component.css']
})
export default class MovieSearchComponent implements OnInit {
  panelOpenState = false;

  contentRatings: string[] = ['G', 'PG', 'PG-13', 'R', 'NC-17'];
  contentRatingsInput: string[] = [];

  // TODO: get genres from server
  genres: string[] = [
    {name: 'Action'}, {name: 'Adventure'}, {name: 'Animation'}, {name: 'Biography'}, {name: 'Comedy'}, {name: 'Crime'}, {name: 'Documentary'}, {name: 'Drama'}, {name: 'Family'}, {name: 'Fantasy'}, {name: 'Film-Noir'}, {name: 'History'}, {name: 'Horror'}, {name: 'Music'}, {name: 'Musical'}, {name: 'Mystery'}, {name: 'Romance'}, {name: 'Sci-Fi'}, {name: 'Sport'}, {name: 'Thriller'}, {name: 'War'}, {name: 'Western'}
  ].map(genre => genre.name);
  genreInput: string[]  = [];
  movies?: Observable<SearchMoviesQuery['searchMovies']>;

  // TODO: get writers from server
  writers: string[] = [];
  writersInput: string[] = [];

  searchForm: FormGroup;
  constructor(
    private readonly fb: FormBuilder,
    private readonly searchMovies: SearchMoviesGQL
  ) { 
    this.searchForm = this.fb.group({
      director: [''],
      // ratings: this.fb.array([
      //   this.fb.group({
      //     score: 0.0,
      //     source: [''],
      //   }),
      // ]),
      releaseYear: [''],
      title: [''],
    });
  }

  ngOnInit(): void { }

  updateContentRatings(contentRatings: string[]): void {
    this.contentRatingsInput = contentRatings;
  }
  updateGenres(genres: string[]): void {
    this.genreInput = genres;
  }
  updateWriters(writers: string[]): void {
    this.writersInput = writers;
  }

  // getContentRatings(): string[] {
  //   const contentRatings = this.searchForm.get('contentRatings')!.getRawValue();
  //   return contentRatings.keys().filter((key: string) => contentRatings.get(key)?.value);
  // }

  #getSearchInput(): SearchMovieInput {
    const director = this.searchForm.get('director')?.value;
    const title = this.searchForm.get('title')?.value;
    const ratings = this.searchForm.get('ratings')?.value;
    const releaseYear = this.searchForm.get('releaseYear')?.value;

    const searchInput: SearchMovieInput = {
      contentRating: this.contentRatingsInput,
      director: director ? director : '',
      genres: this.genreInput,
      ratings: ratings ? ratings : [],
      title: title ? title : '',
      releaseYear: releaseYear ? releaseYear : '',
      writers: this.writersInput,
    };
    return searchInput;
  };
  onSubmit(): void {
    this.movies = this.searchMovies.watch({
      searchMovieInput: this.#getSearchInput(),
    })
      .valueChanges
      .pipe(map(result => result.data.searchMovies));
  }

  logForm(): void {
    console.log(this.#getSearchInput());
  }

}
