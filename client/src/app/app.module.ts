import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects/src';
import { YouTubePlayerModule } from '@angular/youtube-player'

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

import { AppRoutingModule } from './app-routing.module';
import { GraphQLModule } from './core/graph/graphql.module';

import AppComponent from './app.component';
import BannerComponent from './components/banner/banner.component';
import MovieDisplayComponent from './components/movie-display/movie-display.component';
import MovieSearchComponent from './components/movie-search/movie-search.component';
import LoginComponent from './components/login/login.component';

import { FiltersListInputComponent } from './components/filters-list-input/filters-list-input.component';
import { FilterRangeInputComponent } from './components/filter-range-input/filter-range-input.component';
import { MovieDisplayCardComponent } from './components/movie-display-card/movie-display-card.component';
import { MovieTrailerPlayerComponent } from './components/movie-trailer-player/movie-trailer-player.component';

@NgModule({
  declarations: [
    AppComponent,
    BannerComponent,
    MovieDisplayComponent,
    MovieSearchComponent,
    LoginComponent,
    FiltersListInputComponent,
    FilterRangeInputComponent,
    MovieDisplayCardComponent,
    MovieTrailerPlayerComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    GraphQLModule,
    HttpClientModule,
    ReactiveFormsModule,
    YouTubePlayerModule,

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

    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
