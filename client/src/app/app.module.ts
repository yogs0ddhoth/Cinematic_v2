import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';

import { ModalModule } from 'ngx-bootstrap/modal';

import { AppComponent } from './app.component';
import { ApolloTestComponent } from './apollo-test/apollo-test.component';
import { ImdbTestComponent } from './imdb-test/imdb-test.component';
import { LayoutComponent } from './layout/layout.component';
import { SearchFormComponent } from './search-form/search-form.component';
import { MovieDisplayComponent } from './movie-display/movie-display.component';

@NgModule({
  declarations: [
    AppComponent,
    ApolloTestComponent,
    ImdbTestComponent,
    LayoutComponent,
    SearchFormComponent,
    MovieDisplayComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule,
    ModalModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
