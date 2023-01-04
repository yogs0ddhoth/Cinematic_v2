use crate::{serde, FormatUrl};
use getset::{Getters, Setters};

#[derive(Getters, serde::Deserialize, Debug)]
#[serde(rename_all = "PascalCase")]
#[getset(get = "pub")]
pub struct OMDbSearchData {
    search: Option<Vec<OMDbSearchResult>>,
    response: String,
    error: Option<String>,
}

#[derive(Default, Getters, serde::Deserialize, Debug)]
#[getset(get = "pub")]
pub struct OMDbSearchResult {
    // deserialize only the imdbID needed for detailed data request
    #[serde(rename = "imdbID")]
    imdb_id: String,
}
impl OMDbSearchResult {
    /// Constructor Method
    pub fn new(value: String) -> Self {
        OMDbSearchResult { imdb_id: value }
    }
}

#[derive(Getters, serde::Deserialize, Debug)]
#[serde(rename_all = "PascalCase")]
#[getset(get = "pub")]
pub struct OMDbRating {
    source: String,
    value: String,
}
#[derive(Clone, Debug, Default, Setters)]
#[getset(set = "pub")]
pub struct OMDbRatingBuilder {
    source: String,
    value: String,
}
impl OMDbRatingBuilder {
    pub fn build(&self) -> OMDbRating {
        OMDbRating {
            source: self.source.clone(),
            value: self.value.clone(),
        }
    }
}

#[derive(Getters, serde::Deserialize, Debug)]
#[serde(rename_all = "PascalCase")]
#[getset(get = "pub")]
pub struct OMDbMovie {
    #[serde(rename = "imdbID")]
    imdb_id: String,

    title: String,
    year: Option<String>,
    released: Option<String>,
    rated: Option<String>,
    runtime: Option<String>,

    director: Option<String>,
    writer: Option<String>,
    actors: Option<String>,

    plot: Option<String>,
    genre: Option<String>,

    language: Option<String>,
    country: Option<String>,
    awards: Option<String>,
    poster: Option<String>,

    ratings: Option<Vec<OMDbRating>>,
    metascore: Option<String>,
    #[serde(rename = "imdbRating")]
    imdb_rating: Option<String>,
    #[serde(rename = "imdbVotes")]
    imdb_votes: Option<String>,

    box_office: Option<String>,
    production: Option<String>,

    // api specific information
    response: String,
}
#[derive(Debug, Default, Setters)]
#[getset(set = "pub")]
pub struct OMDbMovieBuilder {
    imdb_id: String,

    title: String,
    year: Option<String>,
    released: Option<String>,
    rated: Option<String>,
    runtime: Option<String>,

    director: Option<String>,
    writer: Option<String>,
    actors: Option<String>,

    plot: Option<String>,
    genre: Option<String>,

    language: Option<String>,
    country: Option<String>,
    awards: Option<String>,
    poster: Option<String>,

    ratings: Option<Vec<OMDbRating>>,
    metascore: Option<String>,
    imdb_rating: Option<String>,
    imdb_votes: Option<String>,

    box_office: Option<String>,
    production: Option<String>,

    // api specific information
    response: String,
}
impl OMDbMovieBuilder {
    /// Implementation of the Builder Pattern for OMDbMovie
    pub fn build(self) -> OMDbMovie {
        OMDbMovie {
            imdb_id: self.imdb_id.clone(),
            title: self.title.clone(),
            year: self.year.clone(),
            released: self.released.clone(),
            rated: self.rated.clone(),
            runtime: self.runtime.clone(),
            director: self.director.clone(),
            writer: self.writer.clone(),
            actors: self.actors.clone(),
            plot: self.plot.clone(),
            genre: self.genre.clone(),
            language: self.language.clone(),
            country: self.country.clone(),
            awards: self.awards.clone(),
            poster: self.poster.clone(),
            ratings: self.ratings,
            metascore: self.metascore.clone(),
            imdb_rating: self.imdb_rating.clone(),
            imdb_votes: self.imdb_votes.clone(),
            box_office: self.box_office.clone(),
            production: self.production.clone(),
            response: self.response.clone(),
        }
    }
}

impl FormatUrl for OMDbSearchResult {
    fn fmt_omdb_url(&self) -> String {
        format!(
            "https://www.omdbapi.com/?apikey={key}&i={id}",
            key = self.get_omdb_key(),
            id = self.imdb_id,
        )
    }
}
