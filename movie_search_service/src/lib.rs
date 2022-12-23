pub mod omdb;
pub mod schema;

use async_graphql::Object;
use async_trait::async_trait;
use futures::future;
use omdb::{OMDbMovie, OMDbSearchData, OMDbSearchResult};
use reqwest;
use schema::{Movie, SearchMovieInput};
use serde;
use std::env;

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
        future::join_all(urls.iter().map(|url| async move {
            match self.send_get_request::<T>(url).await {
                Ok(result) => Ok(result),
                Err(err) => Err(err),
            }
        }))
        .await
    }
}

pub struct Query;
#[Object]
impl Query {
    async fn search_movies(
        &self,
        search_movie_input: SearchMovieInput,
    ) -> Result<Vec<Movie>, reqwest::Error> {
        let client = reqwest::Client::new();

        let mut id_urls = Vec::new();
        {
            // Search OMDB for all movies that match search_movie_input, and push the information to id_urls
            let mut search_urls = Vec::new();
            for i in 1..search_movie_input.pages {
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
                    // Filter out error responses, convert OMDbMovie to Movie, and push to movies
                    println!("Filtering results...");
                    match result {
                        Ok(movie) => movies.push(Movie::from(movie)),
                        Err(err) => println!("Found an Error: {:#?}", err),
                    }
                });
        }
        Ok(movies)
    }
}

pub trait FormatUrl {
    fn fmt_omdb_url(&self) -> String;
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
    pub fn check_for_null(field: &String) -> Option<String> {
        match field.as_str() {
            "N/A" => None,
            _ => Some(field.to_string()),
        }
    }
}
impl From<OMDbMovie> for Movie {
    fn from(t: OMDbMovie) -> Self {
        Movie {
            imdb_id: Movie::check_for_null(&t.imdb_id),

            title: Movie::check_for_null(&t.title),
            year: Movie::check_for_null(&t.year),
            released: Movie::check_for_null(&t.released),
            content_rating: Movie::check_for_null(&t.rated),
            runtime: Movie::check_for_null(&t.runtime),

            director: Movie::check_for_null(&t.director),
            writer: Movie::check_for_null(&t.writer),
            actors: match t.actors.len() > 0 {
                true => Some(
                    t.actors
                        .split(", ")
                        .map(|actor| schema::Actor {
                            name: actor.to_string(),
                        })
                        .collect(),
                ),
                false => None,
            },

            plot: Movie::check_for_null(&t.plot),
            genres: match t.actors.len() > 0 {
                true => Some(
                    t.genre
                        .split(", ")
                        .map(|genre| schema::Genre {
                            name: genre.to_string(),
                        })
                        .collect(),
                ),
                false => None,
            },

            language: Movie::check_for_null(&t.language),
            country: Movie::check_for_null(&t.country),
            awards: Movie::check_for_null(&t.awards),
            image: Movie::check_for_null(&t.poster),

            ratings: match t.ratings.len() > 0 {
                true => Some(
                    t.ratings
                        .iter()
                        .map(|rating| schema::Rating {
                            source: rating.source.to_string(),
                            score: rating.value.to_string(),
                        })
                        .collect(),
                ),
                false => None,
            },

            imdb_votes: Movie::check_for_null(&t.imdb_votes),
            box_office: Movie::check_for_null(&t.box_office),
            production: Movie::check_for_null(&t.production),
        }
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
            release_year: String::default(),
            user_rating: String::default(),
            pages: 1,
            content_rating: String::default(),
            genres: String::default(),
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
            release_year: String::default(),
            user_rating: String::default(),
            pages: 1,
            content_rating: String::default(),
            genres: String::default(),
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
                // println!("{:#?}", result_1);
                // println!("{:#?}", result_2);
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
    async fn many_get_requests_work() {
        dotenv().ok();

        let test_search_movie_input = SearchMovieInput {
            title: String::from("Star%20Wars"),
            release_year: String::default(),
            user_rating: String::default(),
            pages: 3,
            content_rating: String::default(),
            genres: String::default(),
        };
        let client = reqwest::Client::new();

        let mut id_urls = Vec::new();
        {
            // Search OMDB for all movies that match search_movie_input, and push the information to id_urls
            let mut search_urls = Vec::new();
            for i in 1..test_search_movie_input.pages {
                search_urls.push(format!(
                    "{url}&page={num}",
                    url = test_search_movie_input.fmt_omdb_url(),
                    num = i
                ));
            }

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
        assert!(id_urls.len() > 0);
    }
}
