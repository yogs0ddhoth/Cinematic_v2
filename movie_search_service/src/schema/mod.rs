use async_graphql::{InputObject, SimpleObject};

#[derive(Debug, SimpleObject)]
pub struct Genre {
    pub name: String,
}

#[derive(Debug, SimpleObject)]
pub struct Actor {
    pub name: String,
}

#[derive(Debug, SimpleObject)]
pub struct MovieTrailers {
    pub title: String,
}

#[derive(Debug, SimpleObject)]
pub struct Rating {
    pub source: String,
    pub score: String,
}

#[derive(Debug, SimpleObject)]
#[graphql(rename_fields = "camelCase")]
pub struct Movie {
    #[graphql(name = "imdbID")]
    pub imdb_id: Option<String>,

    pub title: String,
    pub year: Option<String>,
    pub released: Option<String>,
    pub content_rating: Option<String>,
    pub runtime: Option<String>,

    pub director: Option<String>,
    pub writer: Option<String>,
    pub actors: Option<Vec<Actor>>,

    pub plot: Option<String>,
    pub genres: Option<Vec<Genre>>,

    pub language: Option<String>,
    pub country: Option<String>,
    pub awards: Option<String>,
    pub image: Option<String>,
    pub trailers: MovieTrailers,

    pub ratings: Option<Vec<Rating>>,
    pub imdb_votes: Option<String>,

    pub box_office: Option<String>,
    pub production: Option<String>,
}

#[derive(Debug, InputObject)]
#[graphql(rename_fields = "camelCase")]
pub struct SearchMovieInput {
    pub content_rating: Option<String>,
    pub genres: Option<String>,
    pub ratings: Option<Vec<RatingInput>>,

    #[graphql(default)]
    pub release_year: String,

    #[graphql(default)]
    pub title: String,

    #[graphql(default = 1)]
    pub pages: i32,
}

#[derive(Debug, InputObject)]
#[graphql(rename_fields = "camelCase")]
pub struct RatingInput {
    pub source: String,
    pub score: f64,
}