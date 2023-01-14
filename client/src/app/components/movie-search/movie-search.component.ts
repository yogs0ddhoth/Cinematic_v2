import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { SearchMovieInput, SearchMoviesGQL, SearchMoviesQuery } from 'src/app/core/graph/generated';

@Component({
  selector: 'app-movie-search',
  templateUrl: './movie-search.component.html',
  styleUrls: ['./movie-search.component.css']
})
export default class MovieSearchComponent implements OnInit {
  movies?: Observable<SearchMoviesQuery['searchMovies']>;

  searchForm = new FormGroup({
    title: new FormControl<string>(''),
  });
  constructor(private readonly searchMovies: SearchMoviesGQL) { }

  ngOnInit(): void { }

  #getSearchInput(): SearchMovieInput {
    const title = this.searchForm.get('title')?.value;
    const searchInput: SearchMovieInput = {
      title: title ? title : '',
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


}
