pub mod omdb;
pub mod schema;

use async_graphql::Object;
use async_trait::async_trait;
use futures::{stream, StreamExt};
use omdb::{OMDbMovie, OMDbSearchData, OMDbSearchResult, OMDbRating};
use reqwest;
use schema::{Movie, MovieTrailers, SearchMovieInput, RatingInput};
use serde;
use std::{env, collections::HashMap};

// maximum number of concurrent requests
const MAX_CONCURRENT_REQUESTS: usize = 50;

#[async_trait]
trait Request {
    async fn send_get_request<T: for<'de> serde::Deserialize<'de>>(
        &self,
        url: &String,
    ) -> Result<T, reqwest::Error>;

    async fn send_many_get_requests<T: for<'de> serde::Deserialize<'de> + std::marker::Send>(
        &self,
        urls: Vec<String>,
    ) -> Vec<Result<T, reqwest::Error>>;
}
#[async_trait]
impl Request for reqwest::Client {
    /// Build and send GET request to url, deserialize response to type parameter, propogate error, and return results
    async fn send_get_request<T: for<'de> serde::Deserialize<'de>>(
        &self,
        url: &String,
    ) -> Result<T, reqwest::Error> {
        println!("Fetching {:#?}...", url);
        let results = self.get(url).send().await?.json::<T>().await?;
        Ok(results)
    }
    /// Concurrently send GET requests that deserialize to the same type, and return the results
    async fn send_many_get_requests<T: for<'de> serde::Deserialize<'de> + std::marker::Send>(
        &self,
        urls: Vec<String>,
    ) -> Vec<Result<T, reqwest::Error>> {
        stream::iter(
            // convert the iterator of futures into a stream
            urls.into_iter().map(|url| async move {
                match self.send_get_request::<T>(&url).await {
                    Ok(result) => Ok(result),
                    Err(err) => Err(err),
                }
            }),
        )
        // buffer the max number of concurrent requests at a time to prevent resource overload
        .buffer_unordered(MAX_CONCURRENT_REQUESTS)
        .collect::<Vec<Result<T, reqwest::Error>>>()
        .await
    }
}

impl OMDbMovie {
    async fn get_omdb_movies(search_movie_input: SearchMovieInput) -> Vec<OMDbMovie> {
        let client = reqwest::Client::new();
        let mut id_urls = Vec::new();
        {
            // Search OMDB for all movies that match search_movie_input, and push the information to id_urls
            let mut search_urls = Vec::new();
            for i in 1..search_movie_input.pages + 1 {
                // for pagination
                // push urls for each page (see omdb api) to search_urls
                search_urls.push(format!(
                    "{url}&page={num}",
                    url = search_movie_input.fmt_omdb_url(),
                    num = i
                ));
            }
            // concurrently send requests for each of the urls
            client
                .send_many_get_requests::<OMDbSearchData>(search_urls)
                .await
                .iter()
                .for_each(|results| {
                    // Filter out error responses, convert search_results to omdb_url Strings, and push to id_urls
                    println!("Filtering results...");
                    match results {
                        Ok(data) => match &data.search {
                            Some(result_page) => {
                                for result in result_page {
                                    id_urls.push(result.fmt_omdb_url())
                                }
                            }
                            None => match &data.error {
                                Some(err) => println!("Found an Error: {}", err),
                                None => (),
                            },
                        },
                        Err(err) => println!("Found an Error: {:#?}", err),
                    }
                });
        }

        let mut movies = Vec::new();
        {
            // concurrently send requests for each of the id url
            client
                .send_many_get_requests::<OMDbMovie>(id_urls)
                .await
                .into_iter()
                .for_each(|result| {
                    println!("Filtering results...");
                    match result {
                        // Filter out error responses
                        Ok(movie) => if search_movie_input.match_filters(&movie) {
                            movies.push(movie)
                        }
                        Err(err) => println!("Found an Error: {:#?}", err),
                    }
                });
        }
        println!("Done! Sending response...");
        movies
    }
}

pub trait FormatUrl {
    fn fmt_omdb_url(&self) -> String;
    /// Get OMDB_KEY from enviornmental variables. Return "NO_KEY" if none found.
    fn get_omdb_key(&self) -> String {
        match env::var("OMDB_KEY") {
            Ok(data) => data,
            Err(data) => {
                println!("Error getting OMDb Key: {:#?}", data);
                String::from("NO_KEY")
            }
        }
    }
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
impl SearchMovieInput {
    /// Apply filters, if defined, to movie
    /// Returns true if the movie matches filters
    fn match_filters(&self, OMDbMovie { rated, genre, ratings, .. }: &OMDbMovie) -> bool {
        if let Some(content_rating) = &self.content_rating {
            match rated {
                Some(rated) => if !(content_rating == rated) {
                    return false;
                }
                None => return false,
            }
        }
        if let Some(genres) = &self.genres {
            match genre {
                Some(genre) => if !genre.contains(genres) {
                    return false;
                }
                None => return false,
            }
            return false;
        }
        if let Some(ratings_filter) = &self.ratings {
            match ratings {
                Some(ratings) => {
                    let mut ratings_map: HashMap<String, String> = HashMap::new();
                    for OMDbRating { source, value } in ratings {
                        ratings_map.insert(source.to_string(), value.to_string());
                    }

                    for RatingInput { source, score } in ratings_filter {
                        match ratings_map.contains_key(source) {
                            true => match source.as_str() {
                                // TODO: ADD ERROR HANDLING AND TEST
                                "Internet Movie Database" | "Metacritic" => {
                                    let rating_value = ratings_map.get(source).unwrap()
                                        .trim().split("/").next().unwrap()
                                        .parse::<f64>().unwrap()
                                    ;
                                    if score < &rating_value {
                                        return false
                                    }
                                }
                                "Rotten Tomatoes" => {
                                    let rating_value = ratings_map.get(source).unwrap()
                                        .trim().split("%").next().unwrap()
                                        .parse::<f64>().unwrap()
                                    ;
                                    if score < &rating_value {
                                        return false
                                    }
                                }
                                _ => {
                                    println!("Invalid Rating Source: {}", source);
                                    continue;
                                }
                            }
                            false => return false,
                        }
                    }
                }
                None => return false,
            }
        }
        true
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
                            .map(|actor| schema::Actor {
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
                            .map(|genre| schema::Genre {
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
                        .map(|OMDbRating { source, value }| schema::Rating {
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

#[cfg(test)]
mod tests {
    use super::*;
    use dotenvy::dotenv;
    use tokio;

    #[test]
    fn fmt_omdb_url_works() {
        let test_search_movie_input = SearchMovieInput {
            title: String::from("Star%20Wars"),
            release_year: String::new(),
            ratings: None,
            pages: 1,
            content_rating: None,
            genres: None,
        };
        let test_omdb_search_result = OMDbSearchResult {
            imdb_id: String::from("tt0076759"),
        };
        let test_omdb_search_url = test_omdb_search_result.fmt_omdb_url();
        let test_search_movie_url = test_search_movie_input.fmt_omdb_url();
        // println!("{test_omdb_search_url}");
        // println!("{test_search_movie_url}");

        assert_eq!(
            "https://www.omdbapi.com/?apikey=NO_KEY&s=Star%20Wars&y=",
            test_search_movie_url
        );
        assert_eq!(
            "https://www.omdbapi.com/?apikey=NO_KEY&i=tt0076759",
            test_omdb_search_url
        );
    }

    #[tokio::test]
    async fn get_requests_work() {
        dotenv().ok();

        let test_search_movie_input = SearchMovieInput {
            title: String::from("Star%20Wars"),
            release_year: String::new(),
            ratings: None,
            pages: 1,
            content_rating: None,
            genres: None,
        };
        let test_search_movie_url = test_search_movie_input.fmt_omdb_url();

        let test_omdb_search_result = OMDbSearchResult {
            imdb_id: String::from("tt0076759"),
        };
        let test_omdb_search_url = test_omdb_search_result.fmt_omdb_url();

        let client = reqwest::Client::new();

        let (omdb_results_1, omdb_results_2) = tokio::join!(
            client.send_get_request::<OMDbSearchData>(&test_search_movie_url),
            client.send_get_request::<OMDbMovie>(&test_omdb_search_url),
        );

        match (omdb_results_1, omdb_results_2) {
            (Ok(result_1), Ok(result_2)) => {
                assert!(result_1.search.is_some());
                assert!(result_2.imdb_id == "tt0076759");
            }
            (Ok(_), Err(err)) => {
                println!("Caught Error: {:#?}", err);
                panic!("Request Errors");
            }
            (Err(err), Ok(_)) => {
                println!("Caught Error: {:#?}", err);
                panic!("Request Errors");
            }
            (Err(err_1), Err(err_2)) => {
                println!("Caught Errors: {:#?}, {:#?}", err_1, err_2);
                panic!("Request Errors");
            }
        };
    }

    #[tokio::test]
    async fn many_get_requests_with_filters_work() {
        dotenv().ok();

        let test_search_movie_input = SearchMovieInput {
            title: String::from("Star%20Wars"),
            release_year: String::new(),
            ratings: None,
            pages: 3,
            content_rating: Some(String::from("PG")),
            genres: Some(String::from("Action")),
        };
        let client = reqwest::Client::new();

        let mut id_urls = Vec::new();
        {
            // Search OMDB for all movies that match search_movie_input, and push the information to id_urls
            let mut search_urls = Vec::new();
            for i in 1..test_search_movie_input.pages + 1 {
                search_urls.push(format!(
                    "{url}&page={num}",
                    url = test_search_movie_input.fmt_omdb_url(),
                    num = i
                ));
            }
            assert!(search_urls.len() == 3);

            // concurrently send requests for each of the urls
            client
                .send_many_get_requests::<OMDbSearchData>(search_urls)
                .await
                .iter()
                .for_each(|results| {
                    // Filter out error responses and convert search_results into imdb ids of type String and push to id_urls
                    match results {
                        Ok(data) => match &data.search {
                            Some(result_page) => {
                                for result in result_page {
                                    id_urls.push(result.fmt_omdb_url())
                                }
                            }
                            None => match &data.error {
                                Some(err) => {
                                    println!("Found an Error: {}", err);
                                    panic!("Request Errors");
                                }
                                None => panic!("Request Errors: No Result found."),
                            },
                        },
                        Err(err) => {
                            println!("Found an Error: {:#?}", err);
                            panic!("Request Errors");
                        }
                    }
                });
        }
        // this request should produce results
        assert!(id_urls.len() == 30);

        let mut movies = Vec::new();
        {
            // concurrently send requests for each of the id url
            client
                .send_many_get_requests::<OMDbMovie>(id_urls)
                .await
                .into_iter()
                .for_each(|result| {
                    match result {
                        // Filter out error responses
                        Ok(movie) => if test_search_movie_input.match_filters(&movie) {
                            assert_eq!(movie.rated, test_search_movie_input.content_rating);
                            if let Some(genre) = &movie.genre {
                                assert!(genre.contains(&String::from("PG")));
                            } else {
                                panic!("match_filters failed to filter out None values")
                            }
                            movies.push(movie)
                        }
                        Err(err) => {
                            println!("Found an Error: {:#?}", err); 
                            panic!("Request Errors");
                        }
                    }
                });
        }
        assert!(movies.len() > 0);
        println!("{:#?}", movies);
    }
}
