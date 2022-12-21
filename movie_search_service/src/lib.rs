pub mod imdb;
pub mod omdb;

pub mod schema;

use actix_web::error::HttpError;
use async_graphql::Object;
use async_trait::async_trait;
use omdb::{OMDBSearchData, OMDBSearchResult, OMDbMovie};
use reqwest;
use schema::{Movie, SearchMovieInput};
use serde;
use std::{borrow::Borrow, env, result};
use tokio;

#[async_trait]
trait Request {
    async fn send_get_reqwest<T: for<'de> serde::Deserialize<'de>>(
        &self,
        url: String,
    ) -> Result<T, reqwest::Error>;
}

#[async_trait]
impl Request for reqwest::Client {
    /// build and send GET request to url, deserialize response to type parameter, and return results
    async fn send_get_reqwest<T: for<'de> serde::Deserialize<'de>>(
        &self,
        url: String,
    ) -> Result<T, reqwest::Error> {
        println!("{:#?} Fetching...", url);
        let response = match self.get(url).send().await {
            Ok(data) => data,
            Err(e) => return Err(e.without_url()),
        };

        println!("Fetched! Serializing response...");
        let results = match response.json::<T>().await {
            Ok(data) => data,
            Err(e) => return Err(e.without_url()),
        };

        println!("Response Serialized. Sending data...");
        Ok(results)
    }
}

pub struct Query;

#[Object]
impl Query {
    async fn search_movies(
        &self,
        search_movie_input: SearchMovieInput,
    ) -> Result<Vec<Movie>, reqwest::Error> {
        // let mut imdb_results = imdb::call_imdb(fmt_imdb_url(search_movie_input)).await;

        let client = reqwest::Client::new();
        // let movies = Vec::new();
        {
            let (mut omdb_results_1, mut omdb_results_2) = tokio::join!(
                client.send_get_reqwest::<OMDBSearchData>(search_movie_input.fmt_omdb_url()),
                client.send_get_reqwest::<OMDBSearchData>(
                    search_movie_input.fmt_omdb_url() + "&page=2"
                ),
            );

            // let ids = match (omdb_results_1?.search, omdb_results_2?.search) {
            //     (Some(mut results_1), Some(mut results_2)) => {
            //         results_1.append(&mut results_2);
            //     }
            //     // (Some(results_1), None) => {}
            //     // (None, None) => return Err(/** TODO implement Error Type for this situation */),
            //     // _ => return Err("Inconsistant search results")
            // };
        }
        /* *
         * TODO:
         *  - call async omdb searches of each element of omdb_results_1.search and omdb_results_2.search
         *  - update Movie fields
         *  - add new() impl method that combines OMDbMovie and IMDbMovie to make a new movie
         */
        Ok(/* Placeholder result */ vec![Movie {
            imdb_id: todo!(),
            image: todo!(),
            title: todo!(),
            description: todo!(),
            runtime_str: todo!(),
            genre_list: todo!(),
            content_rating: todo!(),
            im_db_rating: todo!(),
            im_db_rating_votes: todo!(),
            metacritic_rating: todo!(),
            plot: todo!(),
            star_list: todo!(),
        }])
    }
}

pub trait FormatUrl {
    fn fmt_omdb_url(&self) -> String;
}

impl FormatUrl for SearchMovieInput {
    fn fmt_omdb_url(&self) -> String {
        let omdb_key = match env::var("OMDB_KEY") {
            Ok(data) => data,
            Err(data) => {
                println!("Error getting OMDb Key: {:#?}", data);
                String::from("NO_KEY")
            }
        };
        format!(
            "https://www.omdbapi.com/?apikey={key}&s={title}&y={year}",
            key = omdb_key,
            title = self.title,
            year = self.release_year,
        )
    }
}
impl FormatUrl for OMDBSearchResult {
    fn fmt_omdb_url(&self) -> String {
        let omdb_key = match env::var("OMDB_KEY") {
            Ok(data) => data,
            Err(data) => {
                println!("Error getting OMDb Key: {:#?}", data);
                String::from("NO_KEY")
            }
        };
        format!(
            "https://www.omdbapi.com/?apikey={key}&i={id}",
            key = omdb_key,
            id = self.imdb_id,
        )
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use dotenvy::dotenv;

    /// test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 2 filtered out; finished in 0.32s
    #[tokio::test]
    async fn get_requests_work() {
        dotenv().ok();

        let test_search_movie_input = SearchMovieInput {
            title: String::from("Star%20Wars"),
            release_year: String::default(),
            user_rating: String::default(),
        };
        let test_omdb_search_result = OMDBSearchResult {
            imdb_id: String::from("tt0076759"),
        };

        let client = reqwest::Client::new();

        let (omdb_results_1, omdb_results_2) = tokio::join!(
            client.send_get_reqwest::<OMDBSearchData>(test_search_movie_input.fmt_omdb_url()),
            client.send_get_reqwest::<OMDbMovie>(test_omdb_search_result.fmt_omdb_url()),
        );
        println!("{:#?}", omdb_results_1);
        println!("{:#?}", omdb_results_2);
        match (omdb_results_1, omdb_results_2) {
            (Ok(result_1), Ok(result_2)) => (result_1, result_2),
            _ => panic!("Something went wrong with results"),
        };
    }
}
