use std::{
    collections::{HashMap, HashSet},
    num::ParseFloatError,
};

use super::{
    // local modules:
    omdb_models::*,
    // traits:
    FormatUrl,
    // external crates:
    InputObject,
    SimpleObject, // from async_graphql
};

#[derive(Debug, SimpleObject)]
pub struct Genre {
    name: String,
    movies: Option<Vec<Movie>>,
}
impl Genre {
    /// Constructor Method
    pub fn new(value: String) -> Self {
        Genre {
            name: value,
            movies: None,
        }
    }
}

#[derive(Debug, SimpleObject)]
pub struct Director {
    name: String,
    movies: Option<Vec<Movie>>,
}
impl Director {
    /// Constructor Method
    pub fn new(value: String) -> Self {
        Director {
            name: value,
            movies: None,
        }
    }
}

#[derive(Debug, SimpleObject)]
pub struct Actor {
    name: String,
    movies: Option<Vec<Movie>>,
}
impl Actor {
    /// Constructor Method
    pub fn new(value: String) -> Self {
        Actor {
            name: value,
            movies: None,
        }
    }
}

#[derive(Debug, SimpleObject)]
pub struct Writer {
    name: String,
    movies: Option<Vec<Movie>>,
}
impl Writer {
    /// Constructor Method
    pub fn new(value: String) -> Self {
        Writer {
            name: value,
            movies: None,
        }
    }
}

#[derive(Debug, SimpleObject)]
pub struct MovieTrailers {
    title: String,
}
impl MovieTrailers {
    /// Constructor Method
    pub fn new(value: String) -> Self {
        MovieTrailers { title: value }
    }
}

#[derive(Debug, SimpleObject)]
pub struct Rating {
    source: String,
    score: String,
}
impl From<&OMDbRating> for Rating {
    fn from(value: &OMDbRating) -> Self {
        Rating {
            source: value.source().to_string(),
            score: value.value().to_string(),
        }
    }
}

#[derive(Debug, SimpleObject)]
#[graphql(rename_fields = "camelCase")]
pub struct Movie {
    #[graphql(name = "imdbID")]
    imdb_id: Option<String>,

    title: String,
    year: Option<String>,
    released: Option<String>,
    content_rating: Option<String>,
    runtime: Option<String>,

    director: Option<Director>,
    writers: Option<Vec<Writer>>,
    actors: Option<Vec<Actor>>,

    plot: Option<String>,
    genres: Option<Vec<Genre>>,

    language: Option<String>,
    country: Option<String>,
    awards: Option<String>,
    image: Option<String>,
    trailers: MovieTrailers,

    ratings: Option<Vec<Rating>>,
    imdb_votes: Option<String>,

    production: Option<String>,
    box_office: Option<String>,
}
#[allow(dead_code)]
impl Movie {
    /// Check String, and if "N/A", return None
    pub fn check_string_for_null(field: &Option<String>) -> Option<String> {
        match field {
            Some(data) => match data.as_str() {
                "N/A" => None,
                _ => Some(data.to_string()),
            },
            None => None,
        }
    }

    /// Getter for the length of the released field value, if Some, for testing
    pub fn get_released(&self) -> Option<usize> {
        match &self.released {
            Some(released) => Some(released.len()),
            None => None,
        }
    }
    /// Getter for the length of the writers field vector, if Some, for testing
    pub fn get_writers(&self) -> Option<usize> {
        match &self.writers {
            Some(writers) => Some(writers.len()),
            None => None,
        }
    }
    /// Getter for the length of the actors field vector, if Some, for testing
    pub fn get_actors(&self) -> Option<usize> {
        match &self.actors {
            Some(actors) => Some(actors.len()),
            None => None,
        }
    }
    /// Getter for the length of the genres field vector, if Some, for testing
    pub fn get_genres(&self) -> Option<usize> {
        match &self.genres {
            Some(genres) => Some(genres.len()),
            None => None,
        }
    }
    /// Getter for the length of the ratings field vector, if Some, for testing
    pub fn get_ratings(&self) -> Option<usize> {
        match &self.ratings {
            Some(ratings) => Some(ratings.len()),
            None => None,
        }
    }
    /// Getter for the length of the ratings field vector, if Some, for testing
    pub fn get_production(&self) -> Option<usize> {
        match &self.production {
            Some(production) => Some(production.len()),
            None => None,
        }
    }
}
impl From<OMDbMovie> for Movie {
    fn from(movie: OMDbMovie) -> Self {
        Movie {
            imdb_id: Some(movie.imdb_id().to_string()),
            title: String::from(movie.title().to_string()),

            year: Self::check_string_for_null(movie.year()),
            released: Self::check_string_for_null(movie.released()),
            content_rating: Self::check_string_for_null(movie.rated()),
            runtime: Self::check_string_for_null(movie.runtime()),

            director: match Self::check_string_for_null(movie.director()) {
                Some(director) => Some(Director::new(director)),
                None => None,
            },
            writers: match Self::check_string_for_null(movie.writer()) {
                Some(writers) => match writers.len() > 0 {
                    true => Some(
                        writers
                            .split(", ")
                            .map(|writer| Writer::new(writer.to_string()))
                            .collect(),
                    ),
                    false => None,
                },
                None => None,
            },
            actors: match Self::check_string_for_null(movie.actors()) {
                Some(actors) => match actors.len() > 0 {
                    true => Some(
                        actors
                            .split(", ")
                            .map(|actor| Actor::new(actor.to_string()))
                            .collect(),
                    ),
                    false => None,
                },
                None => None,
            },

            plot: Self::check_string_for_null(movie.plot()),
            genres: match Self::check_string_for_null(movie.genre()) {
                Some(genres) => match genres.len() > 0 {
                    true => Some(
                        genres
                            .split(", ")
                            .map(|genre| Genre::new(genre.to_string()))
                            .collect(),
                    ),
                    false => None,
                },
                None => None,
            },

            language: Self::check_string_for_null(movie.language()),
            country: Self::check_string_for_null(movie.country()),
            awards: Self::check_string_for_null(movie.awards()),
            image: Self::check_string_for_null(movie.poster()),

            trailers: MovieTrailers::new(movie.title().to_string()),

            ratings: match movie.ratings() {
                Some(ratings) => Some(
                    ratings
                        .into_iter()
                        .map(|rating| Rating::from(rating))
                        .collect(),
                ),
                None => None,
            },

            imdb_votes: Self::check_string_for_null(movie.imdb_votes()),
            box_office: Self::check_string_for_null(movie.box_office()),
            production: Self::check_string_for_null(movie.production()),
        }
    }
}

#[derive(Debug, InputObject)]
#[graphql(rename_fields = "camelCase")]
pub struct SearchMovieInput {
    pub content_rating: Option<Vec<String>>,
    pub director: Option<String>,
    pub genres: Option<Vec<String>>,
    pub ratings: Option<Vec<SearchRatingInput>>,
    pub writers: Option<Vec<String>>,

    #[graphql(default)]
    pub release_year: String,

    pub title: String,

    #[graphql(default = 1)]
    pub pages: i32,
}
impl FormatUrl for SearchMovieInput {
    fn fmt_omdb_url(&self, key: &String) -> String {
        format!(
            "https://www.omdbapi.com/?apikey={key}&s={title}&y={year}",
            key = key,
            title = self.title,
            year = self.release_year,
        )
    }
}

impl SearchMovieInput {
    /// Apply search filters, if defined, to movie
    /// Returns true if the movie matches filters
    pub fn match_filters(&self, movie: &OMDbMovie) -> Result<bool, ParseFloatError> {
        if let Some(content_rating) = &self.content_rating {
            match movie.rated() {
                Some(rated) => {
                    let mut rating_list = HashSet::new();
                    for rating in content_rating {
                        rating_list.insert(rating.as_str());
                    }
                    if !rating_list.contains(rated.as_str()) {
                        return Ok(false);
                    }
                }
                None => return Ok(false),
            }
        }
        if let Some(director_filter) = &self.director {
            match movie.director() {
                Some(director) => {
                    if director != director_filter {
                        return Ok(false);
                    }
                }
                None => return Ok(false),
            }
        }
        if let Some(genre_filters) = &self.genres {
            match movie.genre() {
                Some(genre) => {
                    let genre_list: HashSet<&str> = genre.split(", ").collect();

                    for filter in genre_filters {
                        if !genre_list.contains(filter.as_str()) {
                            return Ok(false);
                        }
                    }
                }
                None => return Ok(false),
            }
        }
        if let Some(ratings_filter) = &self.ratings {
            match movie.ratings() {
                Some(ratings) => {
                    let mut ratings_map: HashMap<String, String> = HashMap::new();
                    for rating in ratings {
                        ratings_map.insert(rating.source().to_string(), rating.value().to_string());
                    }

                    for SearchRatingInput { source, score } in ratings_filter {
                        match ratings_map.contains_key(source) {
                            true => match source.as_str() {
                                "Internet Movie Database" | "Metacritic" => {
                                    let rating_value = ratings_map
                                        .get(source)
                                        .unwrap()
                                        .trim()
                                        .split("/")
                                        .next()
                                        .unwrap()
                                        .parse::<f64>()?;
                                    if score > &rating_value {
                                        return Ok(false);
                                    }
                                }
                                "Rotten Tomatoes" => {
                                    let rating_value = ratings_map
                                        .get(source)
                                        .unwrap()
                                        .trim()
                                        .split("%")
                                        .next()
                                        .unwrap()
                                        .parse::<f64>()?;
                                    if score > &rating_value {
                                        return Ok(false);
                                    }
                                }
                                _ => {
                                    println!("Invalid Rating Source: {}", source);
                                    continue;
                                }
                            },
                            false => return Ok(false),
                        }
                    }
                }
                None => return Ok(false),
            }
        }
        if let Some(writer_filters) = &self.writers {
            match movie.writer() {
                Some(writer) => {
                    let writer_list: HashSet<&str> = writer.split(", ").collect();

                    for filter in writer_filters {
                        if !writer_list.contains(filter.as_str()) {
                            return Ok(false);
                        }
                    }
                }
                None => return Ok(false),
            }
        }
        Ok(true)
    }
}

#[derive(Debug, InputObject)]
#[graphql(rename_fields = "camelCase")]
pub struct SearchRatingInput {
    pub source: String,
    pub score: f64,
}
