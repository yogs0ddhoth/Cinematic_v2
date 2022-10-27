import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-imdb-test',
  templateUrl: './imdb-test.component.html',
  styleUrls: ['./imdb-test.component.css']
})
export class ImdbTestComponent implements OnInit, OnDestroy {
  loading?: boolean;
  movies: any;
  private querySubscription?: Subscription
  constructor(private api: ApiService) { }

  ngOnInit(): void {
  }

  test() {
    // this.querySubscription = 
    this.api.searchMovies({
      title: "Inception", releaseDate: 2010
    })
      .subscribe(({ data, loading }) => {
        this.loading = loading
        this.movies = data && data.searchMovies
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
