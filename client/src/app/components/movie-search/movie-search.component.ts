import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RatingInput, SearchMovieInput, SearchMoviesGQL, SearchMoviesQuery, SearchRatingInput } from 'src/app/core/graph/generated';

interface RatingInputCtrl {
  disabled: boolean;
  source: string;
  score: number;
  max: number;
  step: number;
}

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
  genresInput: string[]  = [];
  movies?: Observable<SearchMoviesQuery['searchMovies']>;

  ratingsInput: RatingInputCtrl[] = [
    { 
      disabled: true, 
      source: 'Internet Movie Database', 
      score: 0, 
      max: 10, 
      step: 0.1 
    },
    { 
      disabled: true, 
      source: 'Rotten Tomatoes', 
      score: 0, 
      max: 100, 
      step: 1 
    },
    { disabled: true, 
      source: 'Metacritic', 
      score: 0, 
      max: 100, 
      step: 1 
    },
  ];

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
      releaseYear: [''],
      title: [''],
    });
  }

  ngOnInit(): void { }

  getRatingInputs(): SearchRatingInput[] {
    const ratings: SearchRatingInput[] = [];
    this.ratingsInput.forEach(rating => {
      if (!rating.disabled) {
        ratings.push({
          source: rating.source,
          score: rating.score,
        });
      }
    });
    return ratings;
  }

  #getSearchInput(): SearchMovieInput {
    const director = this.searchForm.get('director')?.value;
    const title = this.searchForm.get('title')?.value;
    const releaseYear = this.searchForm.get('releaseYear')?.value;

    const searchInput: SearchMovieInput = {
      contentRating: this.contentRatingsInput,
      director: director ? director : '',
      genres: this.genresInput,
      ratings: this.getRatingInputs(),
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
