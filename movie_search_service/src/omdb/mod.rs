use serde;

#[derive(serde::Deserialize, Debug)]
#[serde(rename_all = "PascalCase")]
pub struct OMDBSearchData {
    pub search: Option<Vec<OMDBSearchResult>>,
    pub response: String,
    pub error:Option<String>
}

#[derive(serde::Deserialize, Debug)]
pub struct OMDBSearchResult {
    // deserialize only the imdbID needed for detailed data request
    #[serde(rename = "imdbID")]
    pub imdb_id: String
}

#[derive(serde::Deserialize, Debug)]
#[serde(rename_all = "PascalCase")]
pub struct OMDbRating {
    source: String,
    value: String,
}

#[derive(serde::Deserialize, Debug)]
#[serde(rename_all = "PascalCase")]
pub struct OMDbMovie {
    pub title: String,
    pub year: String,
    pub rated: String,
    pub released: String,
    pub runtime: String,
    pub genre: String,
    pub director: String,
    pub writer: String,
    pub actors: String,
    pub plot: String,
    pub language: String,
    pub country: String,
    pub awards: String,
    pub poster: String,
    pub ratings: Vec<OMDbRating>,
    pub metascore: String,
    #[serde(rename = "imdbRating")]
    pub imdb_rating: String,
    #[serde(rename = "imdbVotes")]
    pub imdb_votes: String,
    #[serde(rename = "imdbID")]
    pub imdb_id: String,
    pub box_office: String,
    pub production: String,
    pub response: String,
}