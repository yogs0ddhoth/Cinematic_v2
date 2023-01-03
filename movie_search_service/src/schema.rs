use super::{
    client::{OMDbMovie, OMDbRating, Search},
    Filter, FormatUrl,
};
use async_graphql::{InputObject, Object, SimpleObject};
use std::collections::HashMap;

#[derive(Debug, SimpleObject)]
pub struct Genre {
    pub name: String,
}

#[derive(Debug, SimpleObject)]
pub struct Actor {
    pub name: String,
}

#[derive(Debug, SimpleObject)]
pub struct MovieTrailers {
    pub title: String,
}

#[derive(Debug, SimpleObject)]
pub struct Rating {
    pub source: String,
    pub score: String,
}

#[derive(Debug, SimpleObject)]
#[graphql(rename_fields = "camelCase")]
pub struct Movie {
    #[graphql(name = "imdbID")]
    pub imdb_id: Option<String>,

    pub title: String,
    pub year: Option<String>,
    pub released: Option<String>,
    pub content_rating: Option<String>,
    pub runtime: Option<String>,

    pub director: Option<String>,
    pub writer: Option<String>,
    pub actors: Option<Vec<Actor>>,

    pub plot: Option<String>,
    pub genres: Option<Vec<Genre>>,

    pub language: Option<String>,
    pub country: Option<String>,
    pub awards: Option<String>,
    pub image: Option<String>,
    pub trailers: MovieTrailers,

    pub ratings: Option<Vec<Rating>>,
    pub imdb_votes: Option<String>,

    pub box_office: Option<String>,
    pub production: Option<String>,
}

#[derive(Debug, InputObject)]
#[graphql(rename_fields = "camelCase")]
pub struct SearchMovieInput {
    pub content_rating: Option<String>,
    pub genres: Option<String>,
    pub ratings: Option<Vec<RatingInput>>,

    #[graphql(default)]
    pub release_year: String,

    #[graphql(default)]
    pub title: String,

    #[graphql(default = 1)]
    pub pages: i32,
}

#[derive(Debug, InputObject)]
#[graphql(rename_fields = "camelCase")]
pub struct RatingInput {
    pub source: String,
    pub score: f64,
}

impl FormatUrl for SearchMovieInput {
    fn fmt_omdb_url(&self) -> String {
        format!(
            "https://www.omdbapi.com/?apikey={key}&s={title}&y={year}",
            key = self.get_omdb_key(),
            title = self.title,
            year = self.release_year,
        )
    }
}

impl Filter<OMDbMovie> for SearchMovieInput {
    /// Apply filters, if defined, to movie
    /// Returns true if the movie matches filters
    fn match_filters(
        &self,
        OMDbMovie {
            rated,
            genre,
            ratings,
            ..
        }: &OMDbMovie,
    ) -> bool {
        if let Some(content_rating) = &self.content_rating {
            match rated {
                Some(rated) => {
                    if !(content_rating == rated) {
                        return false;
                    }
                }
                None => return false,
            }
        }
        if let Some(genres) = &self.genres {
            match genre {
                Some(genre) => {
                    if !genre.contains(genres) {
                        return false;
                    }
                }
                None => return false,
            }
            return false;
        }
        // if let Some(ratings_filter) = &self.ratings {
        //     match ratings {
        //         Some(ratings) => {
        //             let mut ratings_map: HashMap<String, String> = HashMap::new();
        //             for OMDbRating { source, value } in ratings {
        //                 ratings_map.insert(source.to_string(), value.to_string());
        //             }

        //             for RatingInput { source, score } in ratings_filter {
        //                 match ratings_map.contains_key(source) {
        //                     true => match source.as_str() {
        //                         // TODO: ADD ERROR HANDLING AND TEST
        //                         "Internet Movie Database" | "Metacritic" => {
        //                             let rating_value = ratings_map
        //                                 .get(source)
        //                                 .unwrap()
        //                                 .trim()
        //                                 .split("/")
        //                                 .next()
        //                                 .unwrap()
        //                                 .parse::<f64>()
        //                                 .unwrap();
        //                             if score < &rating_value {
        //                                 return false;
        //                             }
        //                         }
        //                         "Rotten Tomatoes" => {
        //                             let rating_value = ratings_map
        //                                 .get(source)
        //                                 .unwrap()
        //                                 .trim()
        //                                 .split("%")
        //                                 .next()
        //                                 .unwrap()
        //                                 .parse::<f64>()
        //                                 .unwrap();
        //                             if score < &rating_value {
        //                                 return false;
        //                             }
        //                         }
        //                         _ => {
        //                             println!("Invalid Rating Source: {}", source);
        //                             continue;
        //                         }
        //                     },
        //                     false => return false,
        //                 }
        //             }
        //         }
        //         None => return false,
        //     }
        // }
        true
    }
}

impl Movie {
    /// Check String, and if "N/A", return None
    fn check_for_null(field: Option<String>) -> Option<String> {
        match field {
            Some(data) => match data.as_str() {
                "N/A" => None,
                _ => Some(data.to_string()),
            },
            None => None,
        }
    }
}
impl From<OMDbMovie> for Movie {
    fn from(t: OMDbMovie) -> Self {
        Movie {
            imdb_id: Some(t.imdb_id),

            title: String::from(&t.title),
            year: Self::check_for_null(t.year),
            released: Self::check_for_null(t.released),
            content_rating: Self::check_for_null(t.rated),
            runtime: Self::check_for_null(t.runtime),

            director: Self::check_for_null(t.director),
            writer: Self::check_for_null(t.writer),
            actors: match Self::check_for_null(t.actors) {
                Some(actors) => match actors.len() > 0 {
                    true => Some(
                        actors
                            .split(", ")
                            .map(|actor| Actor {
                                name: actor.to_string(),
                            })
                            .collect(),
                    ),
                    false => None,
                },
                None => None,
            },

            plot: Self::check_for_null(t.plot),
            genres: match Self::check_for_null(t.genre) {
                Some(genres) => match genres.len() > 0 {
                    true => Some(
                        genres
                            .split(", ")
                            .map(|genre| Genre {
                                name: genre.to_string(),
                            })
                            .collect(),
                    ),
                    false => None,
                },
                None => None,
            },

            language: Self::check_for_null(t.language),
            country: Self::check_for_null(t.country),
            awards: Self::check_for_null(t.awards),
            image: Self::check_for_null(t.poster),

            trailers: MovieTrailers { title: t.title },

            ratings: match t.ratings {
                Some(ratings) => Some(
                    ratings
                        .iter()
                        .map(|OMDbRating { source, value }| Rating {
                            source: source.to_string(),
                            score: value.to_string(),
                        })
                        .collect(),
                ),
                None => None,
            },

            imdb_votes: Self::check_for_null(t.imdb_votes),
            box_office: Self::check_for_null(t.box_office),
            production: Self::check_for_null(t.production),
        }
    }
}

pub struct Query;
#[Object]
impl Query {
    async fn search_movies(&self, search_movie_input: SearchMovieInput) -> Vec<Movie> {
        let movies = OMDbMovie::get_omdb_movies(search_movie_input).await;
        movies.into_iter().map(|movie| Movie::from(movie)).collect()
    }

    #[graphql(entity)]
    async fn find_movie_trailers_by_title<'a>(
        &self,
        #[graphql(key)] title: String,
    ) -> MovieTrailers {
        MovieTrailers { title }
    }
}
