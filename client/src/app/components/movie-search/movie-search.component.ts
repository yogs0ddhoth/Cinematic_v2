import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { SearchMovieInput, SearchMoviesGQL, SearchMoviesQuery, SearchRatingInput } from 'src/app/core/graph/generated';

@Component({
  selector: 'app-movie-search',
  templateUrl: './movie-search.component.html',
  styleUrls: ['./movie-search.component.css']
})
export default class MovieSearchComponent implements OnInit {
  panelOpenState = false;

  movies?: Observable<SearchMoviesQuery['searchMovies']>;

  searchForm: FormGroup;
  
  constructor(
    private readonly fb: FormBuilder,
    private readonly searchMovies: SearchMoviesGQL
  ) { 
    this.searchForm = this.fb.group({
      contentRatings: this.fb.group({
        g: false,
        pg: false,
        pg13: false,
        r: false,
        nc17: false,
      }),
      director: [''],
      genres: this.fb.array([]),
      // ratings: this.fb.array([
      //   this.fb.group({
      //     score: 0.0,
      //     source: [''],
      //   }),
      // ]),
      releaseYear: [''],
      title: [''],
      // writers: this.fb.array([
      //   this.fb.control('')
      // ]),
    });
  }

  ngOnInit(): void { }

  getContentRatings(): string[] {
    return ['g', 'pg', 'pg13', 'r', 'nc17'].map(
      (key) => this.searchForm.get('contentRatingInput')?.get(key)?.value
    );
  }

  #getSearchInput(): SearchMovieInput {
    const contentRating = this.getContentRatings();
    const director = this.searchForm.get('director')?.value;
    const genres = this.searchForm.get('genres')?.value;
    const title = this.searchForm.get('title')?.value;
    const ratings = this.searchForm.get('ratings')?.value;
    const releaseYear = this.searchForm.get('releaseYear')?.value;
    const writers = this.searchForm.get('writers')?.value;

    const searchInput: SearchMovieInput = {
      contentRating,
      director: director ? director : '',
      genres: genres ? genres : [],
      ratings: ratings ? ratings : [],
      title: title ? title : '',
      releaseYear: releaseYear ? releaseYear : '',
      writers: writers ? writers : [],
    };
    return searchInput;
  };
  onSubmit() {
    this.movies = this.searchMovies.watch({
      searchMovieInput: this.#getSearchInput(),
    })
      .valueChanges
      .pipe(map(result => result.data.searchMovies));
  }

  logForm() {
    console.log(this.#getSearchInput());
  }
}
