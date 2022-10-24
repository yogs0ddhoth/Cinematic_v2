import { Component, OnDestroy, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Subscription } from 'rxjs';

type Movie = {
  contentRating?: string | null; // String
  description?: string | null; // String
  genreList?: {
    key: string; // String!
    value?: string | null; // String
  }[];
  genres?: string | null; // String
  id: string; // ID!
  imDbId?: string | null; // String
  imDbRating?: number | null; // Float
  imDbRatingVotes?: number | null; // Int
  image?: string | null; // String
  metacriticRating?: number | null; // Int
  plot?: string | null; // String
  runtimeStr?: string | null; // String
  starList?: {
    id: string; // String!
    name?: string | null; // String
  }[];
  stars?: string | null; // String
  title: string; // String!
}
type Response = {
  getMovies: Array<Movie|null>
}
const TEST = gql<Response, null>`
  query GetMovies {
    getMovies {
      id
      contentRating
      description
      genreList {
        value
      }
      genres
      imDbRating
      imDbRatingVotes
      image
      metacriticRating
      plot
      runtimeStr
      starList {
        name
      }
      stars
      title
      imDbId
    }
  }
`
@Component({
  selector: 'app-apollo-test',
  templateUrl: './apollo-test.component.html',
  styleUrls: ['./apollo-test.component.css']
})
export class ApolloTestComponent implements OnInit, OnDestroy {

  constructor(private apollo: Apollo) {
    apollo.watchQuery({
      query: TEST,
    }).valueChanges
      .subscribe(result => {
        console.log(result.data.getMovies)
      })
  }

  ngOnInit(): void {
      
  }
  ngOnDestroy(): void {
      
  }
}
