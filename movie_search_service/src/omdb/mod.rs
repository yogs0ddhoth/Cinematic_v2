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
    pub year: String,
    pub released: String,
    pub rated: String,
    pub runtime: String,

    pub director: String,
    pub writer: String,
    pub actors: String,

    pub plot: String,
    pub genre: String,

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

    pub box_office: String,
    pub production: String,

    // api specific information
    pub response: String,
}
impl OMDbMovie {
    pub fn check_field(&self, field: &String) -> Option<String> {
        match field.as_str() {
            "N/A" => None,
            _ => Some(field.to_string()),
        }
    }
}
