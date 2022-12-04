use serde::Deserialize;
use async_graphql::{SimpleObject, InputObject};

#[derive(Deserialize, Debug)]
pub struct AdvancedSearchData {
    pub queryString: Option<String>,
    pub results: Vec<Movie>,
    pub errorMessage: Option<String>,
}

#[derive(Deserialize, Debug, SimpleObject)]
pub struct Genre {
    pub key: String,
    pub value: String
}

#[derive(Deserialize, Debug, SimpleObject)]
pub struct Star {
    pub id: String,
    pub name: String
}

#[derive(Deserialize, Debug, SimpleObject)]
pub struct Movie {
    pub id: Option<String>,
    pub image: Option<String>,
    pub title: Option<String>,
    pub description: Option<String>,
    pub runtimeStr: Option<String>,
    pub genres: Option<String>,
    pub genreList: Option<Vec<Genre>>,
    pub contentRating: Option<String>,
    pub imDbRating: Option<String>,
    pub imDbRatingVotes: Option<String>,
    pub metacriticRating: Option<String>,
    pub plot: Option<String>,
    pub stars: Option<String>,
    pub starList: Option<Vec<Star>>,
}

#[derive(InputObject)]
pub struct SearchInput {
    #[graphql(default)]
    pub certificates: String,

    #[graphql(default)]
    pub genres: String,

    #[graphql(default)]
    pub releaseDate: String,

    #[graphql(default)]
    pub userRating: String,

    #[graphql(default)]
    pub title: String
}