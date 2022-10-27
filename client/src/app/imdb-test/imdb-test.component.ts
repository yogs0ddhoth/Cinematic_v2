import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService, Movie } from '../api.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-imdb-test',
  templateUrl: './imdb-test.component.html',
  styleUrls: ['./imdb-test.component.css']
})
export class ImdbTestComponent implements OnInit, OnDestroy {
  loading?: boolean;
  movies?: (Movie|null)[];
  error: any
  private querySubscription?: Subscription
  constructor(private api: ApiService) { }

  ngOnInit(): void {
  }

  test() {
    // this.querySubscription = 
    this.api.searchMovies({
      title: "Inception", releaseDate: 2010
    })
      .subscribe({
        next: ({ data, loading }) => {
          this.loading = loading
          this.movies =  data?.searchMovies
        },
        error: error => {
          this.error = error;
          console.log("error:", error);
        }
      })
      // .unsubscribe()
      ;
  }

  test2() {
    console.log(this.loading, this.movies);
  }

  ngOnDestroy() {
    this.querySubscription?.unsubscribe()
  }
}
