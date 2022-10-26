import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ApiService, TEST } from '../api.service';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
// import { ApolloQueryResult } from '@apollo/client';

@Component({
  selector: 'app-apollo-test',
  templateUrl: './apollo-test.component.html',
  styleUrls: ['./apollo-test.component.css']
})
export class ApolloTestComponent implements OnInit, OnDestroy {
  loading = false;
  movies: any;
 
  private querySubscription: Subscription

  constructor(private apollo: Apollo, private api: ApiService) {

    this.querySubscription = this.api.getMovies()
    // .watchQuery({
    //   query: TEST,
    // })
      .valueChanges
      .subscribe(({ data, loading }) => {
        this.loading = loading
        this.movies = data.getMovies
      })

    
  }
  test() {
    // this.querySubscription = this.api.getMovies()
    // // .watchQuery({
    // //   query: TEST,
    // // })
    //   .valueChanges
    //   .subscribe(({ data, loading }) => {
    //     this.loading = loading
    //     this.movies = data.getMovies
    //   })
      console.log(this.movies);
    // this.querySubscription.unsubscribe();
  }

  ngOnInit(): void {
    
  }
  ngOnDestroy() {
    this.querySubscription.unsubscribe()
  }
}
