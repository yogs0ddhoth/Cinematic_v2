import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { ApolloTestComponent } from './apollo-test/apollo-test.component';
import { ImdbTestComponent } from './imdb-test/imdb-test.component';

@NgModule({
  declarations: [
    AppComponent,
    ApolloTestComponent,
    ImdbTestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
