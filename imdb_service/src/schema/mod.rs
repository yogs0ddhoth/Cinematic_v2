use serde::Deserialize;
use async_graphql::{SimpleObject, InputObject};

#[derive(Deserialize, Debug)]
pub struct AdvancedSearchData {
    pub queryString: Option<String>,
    pub results: Vec<Movie>,
    pub errorMessage: Option<String>,
}

#[derive(Deserialize, Debug, SimpleObject)]
struct Genre {
    key: String,
    value: String
}

#[derive(Deserialize, Debug, SimpleObject)]
struct Star {
    id: String,
    name: String
}

#[derive(Deserialize, Debug, SimpleObject)]
pub struct Movie {
    id: Option<String>,
    image: Option<String>,
    title: Option<String>,
    description: Option<String>,
    runtimeStr: Option<String>,
    genres: Option<String>,
    genreList: Option<Vec<Genre>>,
    contentRating: Option<String>,
    imDbRating: Option<String>,
    imDbRatingVotes: Option<String>,
    metacriticRating: Option<String>,
    plot: Option<String>,
    stars: Option<String>,
    starList: Option<Vec<Star>>,
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