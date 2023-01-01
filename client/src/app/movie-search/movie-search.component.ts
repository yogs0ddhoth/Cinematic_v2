import { Component, OnInit } from '@angular/core';
import { Movie } from 'src/graphql';

@Component({
  selector: 'app-movie-search',
  templateUrl: './movie-search.component.html',
  styleUrls: ['./movie-search.component.css']
})
export class MovieSearchComponent implements OnInit {
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
