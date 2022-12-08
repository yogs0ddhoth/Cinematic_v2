use async_graphql::{InputObject, SimpleObject};
use serde;

#[derive(serde::Deserialize, Debug)]
pub struct AdvancedSearchData {
    pub queryString: Option<String>,
    pub results: Vec<Movie>,
    pub errorMessage: Option<String>,
}

#[derive(serde::Deserialize, Debug, SimpleObject)]
struct Genre {
    #[graphql(name = "name")]
    value: String,
}

#[derive(serde::Deserialize, Debug, SimpleObject)]
struct Star {
    #[graphql(name = "imDbMovieID")]
    id: String,

    name: String,
}

#[derive(serde::Deserialize, Debug, SimpleObject)]
pub struct Movie {
    #[graphql(name = "imDbID")]
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
pub struct SearchMovieInput {
    #[graphql(default)]
    pub certificates: String,

    #[graphql(default)]
    pub genres: String,

    #[graphql(default)]
    pub releaseDate: String,

    #[graphql(default)]
    pub userRating: String,

    #[graphql(default)]
    pub title: String,
}
