import { Component, OnInit } from '@angular/core';
import { Movie } from 'src/app/graphql/graphql.generated';

@Component({
  selector: 'app-movie-search',
  templateUrl: './movie-search.component.html',
  styleUrls: ['./movie-search.component.css']
})
export default class MovieSearchComponent implements OnInit {
  movies: Movie[];
  constructor() { 
    this.movies = [
      {
        imdbID: "imdbID",
        title: "Title",
      }
    ]
  }

  ngOnInit(): void {
  }

}
