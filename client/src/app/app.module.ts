import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { GraphQLModule } from './core/graph/graphql.module';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatCommonModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';

import { ModalModule } from 'ngx-bootstrap/modal';

// import { ApolloTestComponent } from './apollo-test/apollo-test.component';
// import { ImdbTestComponent } from './imdb-test/imdb-test.component';

import AppComponent from './app.component';
import BannerComponent from './components/banner/banner.component';
import MovieDisplayComponent from './components/movie-display/movie-display.component';
import MovieSearchComponent from './components/movie-search/movie-search.component';
import LoginComponent from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FiltersListInputComponent } from './components/filters-list-input/filters-list-input.component';
import { FilterRangeInputComponent } from './components/filter-range-input/filter-range-input.component';
import { MovieDisplayCardComponent } from './components/movie-display-card/movie-display-card.component';

@NgModule({
  declarations: [
    AppComponent,
    // ApolloTestComponent,
    // ImdbTestComponent,
    BannerComponent,
    MovieDisplayComponent,
    MovieSearchComponent,
    LoginComponent,
    FiltersListInputComponent,
    FilterRangeInputComponent,
    MovieDisplayCardComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    GraphQLModule,
    HttpClientModule,

    MatAutocompleteModule,
    MatCardModule,
    MatChipsModule,
    MatCheckboxModule,
    MatCommonModule,
    MatDialogModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatSliderModule,
    
    ModalModule.forRoot(),
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
