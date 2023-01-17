import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import LoginComponent from './components/login/login.component';
import MovieSearchComponent from './components/movie-search/movie-search.component';

const routes: Routes = [
  { path: '', component: MovieSearchComponent },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
