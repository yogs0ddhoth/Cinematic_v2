use async_graphql::{InputObject, SimpleObject};
use serde;

#[derive(serde::Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct AdvancedSearchData {
    pub query_string: Option<String>,
    pub results: Vec<Movie>,
    pub error_message: Option<String>,
}

#[derive(serde::Deserialize, Debug, SimpleObject)]
pub struct Genre {
    #[graphql(name = "name")]
    value: String,
}

#[derive(serde::Deserialize, Debug, SimpleObject)]
pub struct Star {
    name: String,
}

#[derive(serde::Deserialize, Debug, SimpleObject)]
#[serde(rename_all = "camelCase")]
pub struct Movie {
    #[graphql(name = "imDbID")]
    pub id: Option<String>,

    pub image: Option<String>,
    pub title: Option<String>,
    pub description: Option<String>,
    pub runtime_str: Option<String>,

    #[graphql(name = "genres")]
    pub genre_list: Option<Vec<Genre>>,

    pub content_rating: Option<String>,
    pub im_db_rating: Option<String>,
    pub im_db_rating_votes: Option<String>,
    pub metacritic_rating: Option<String>,

    pub plot: Option<String>,

    #[graphql(name = "stars")]
    pub star_list: Option<Vec<Star>>,
}

#[derive(InputObject)]
#[graphql(rename_fields = "camelCase")]
pub struct SearchMovieInput {
    #[graphql(default)]
    pub certificates: String,

    #[graphql(default)]
    pub genres: String,

    #[graphql(default)]
    pub release_date: String,

    #[graphql(default)]
    pub user_rating: String,

    #[graphql(default)]
    pub title: String,
}
