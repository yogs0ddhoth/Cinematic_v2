import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApolloTestComponent } from './apollo-test/apollo-test.component';
import { ImdbTestComponent } from './imdb-test/imdb-test.component';
import { MovieDisplayComponent } from './movie-display/movie-display.component';

const routes: Routes = [
  { path: '', component: MovieDisplayComponent },
  { path: 'apollo', component: ApolloTestComponent },
  { path: 'test', component: ImdbTestComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
