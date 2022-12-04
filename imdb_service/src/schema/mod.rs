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
    // pub genreList: Option<Vec<HashMap<String, String>>>,
    pub genreList: Option<Vec<Genre>>,
    pub contentRating: Option<String>,
    pub imDbRating: Option<String>,
    pub imDbRatingVotes: Option<String>,
    pub metacriticRating: Option<String>,
    pub plot: Option<String>,
    pub stars: Option<String>,
    // pub starList: Option<Vec<HashMap<String, String>>>,
    pub starList: Option<Vec<Star>>,
}

#[derive(InputObject)]
pub struct SearchInput {
    pub certificates: Option<String>,
    // pub genres: Option<String>,
    pub releaseDate: Option<i32>,
    // pub userRating: Option<i32>,
    pub title: Option<String>
}