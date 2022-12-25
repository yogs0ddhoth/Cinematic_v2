use serde;

#[derive(serde::Deserialize, Debug)]
#[serde(rename_all = "PascalCase")]
pub struct OMDbSearchData {
    pub search: Option<Vec<OMDbSearchResult>>,
    pub response: String,
    pub error: Option<String>,
}

#[derive(serde::Deserialize, Debug)]
pub struct OMDbSearchResult {
    // deserialize only the imdbID needed for detailed data request
    #[serde(rename = "imdbID")]
    pub imdb_id: String,
}

#[derive(serde::Deserialize, Debug)]
#[serde(rename_all = "PascalCase")]
pub struct OMDbRating {
    pub source: String,
    pub value: String,
}

#[derive(serde::Deserialize, Debug)]
#[serde(rename_all = "PascalCase")]
pub struct OMDbMovie {
    #[serde(rename = "imdbID")]
    pub imdb_id: String,

    pub title: String,
    pub year: Option<String>,
    pub released: Option<String>,
    pub rated: Option<String>,
    pub runtime: Option<String>,

    pub director: Option<String>,
    pub writer: Option<String>,
    pub actors: Option<String>,

    pub plot: Option<String>,
    pub genre: Option<String>,

    pub language: Option<String>,
    pub country: Option<String>,
    pub awards: Option<String>,
    pub poster: Option<String>,

    pub ratings: Vec<OMDbRating>,
    pub metascore: Option<String>,
    #[serde(rename = "imdbRating")]
    pub imdb_rating: Option<String>,
    #[serde(rename = "imdbVotes")]
    pub imdb_votes: Option<String>,

    pub box_office: Option<String>,
    pub production: Option<String>,

    // api specific information
    pub response: String,
}
