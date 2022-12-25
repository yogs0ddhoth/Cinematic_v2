use async_graphql::{InputObject, SimpleObject};

/* TODO: refactor to accomidate new omdb results */
#[derive(Debug, SimpleObject)]
pub struct Genre {
    pub name: String,
}

#[derive(Debug, SimpleObject)]
pub struct Actor {
    pub name: String,
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

    pub ratings: Option<Vec<Rating>>,
    pub imdb_votes: Option<String>,

    pub box_office: Option<String>,
    pub production: Option<String>,
}

#[derive(InputObject)]
#[graphql(rename_fields = "camelCase")]
pub struct SearchMovieInput {
    #[graphql(default)]
    pub content_rating: String,

    #[graphql(default)]
    pub genres: String,

    #[graphql(default)]
    pub release_year: String,

    #[graphql(default)]
    pub user_rating: String,

    #[graphql(default)]
    pub title: String,

    #[graphql(default = 1)]
    pub pages: i32,
}
