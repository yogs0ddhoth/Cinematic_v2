import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { SearchMoviesGQL, SearchMoviesQuery } from 'src/app/core/graph/generated';

@Component({
  selector: 'app-movie-search',
  templateUrl: './movie-search.component.html',
  styleUrls: ['./movie-search.component.css']
})
export default class MovieSearchComponent implements OnInit {
  movies?: Observable<SearchMoviesQuery['searchMovies']>;
  constructor(private readonly searchMovies: SearchMoviesGQL) { }

  ngOnInit(): void { }

  #searchMovies() {
    this.movies = this.searchMovies.watch().valueChanges.pipe(map(result => result.data.searchMovies));
  }
}
