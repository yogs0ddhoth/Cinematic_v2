import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { HttpClientModule } from '@angular/common/http';

import { ModalModule } from 'ngx-bootstrap/modal';

// import { ApolloTestComponent } from './apollo-test/apollo-test.component';
// import { ImdbTestComponent } from './imdb-test/imdb-test.component';

import AppComponent from './app.component';
import BannerComponent from './components/banner/banner.component';
import MovieDisplayComponent from './components/movie-display/movie-display.component';
import MovieSearchComponent from './components/movie-search/movie-search.component';

@NgModule({
  declarations: [
    AppComponent,
    // ApolloTestComponent,
    // ImdbTestComponent,
    BannerComponent,
    MovieDisplayComponent,
    MovieSearchComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    // HttpClientModule,
    ModalModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
