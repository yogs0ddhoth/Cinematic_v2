pub mod imdb;
pub mod omdb;

pub mod schema;

use actix_web::{error::HttpError, http::Error};
use async_graphql::Object;
use async_trait::async_trait;
use futures::{
    future,
    stream::{self, StreamExt},
};
use omdb::{OMDBSearchData, OMDBSearchResult, OMDbMovie};
use reqwest;
use schema::{Movie, SearchMovieInput};
use serde;
use std::{borrow::Borrow, env, result};
use tokio;

#[async_trait]
trait Request {
    async fn send_get_request<T: for<'de> serde::Deserialize<'de>>(
        &self,
        url: &String,
    ) -> Result<T, reqwest::Error>;
}

#[async_trait]
impl Request for reqwest::Client {
    /// build and send GET request to url, deserialize response to type parameter, and return results
    async fn send_get_request<T: for<'de> serde::Deserialize<'de>>(
        &self,
        url: &String,
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

        // Create a Vec<String> of urls based on search_movie_input
        let mut search_urls = Vec::new();
        for i in 1..search_movie_input.pages {
            // for pagination
            search_urls.push(format!(
                "{url}&page={num}",
                url = search_movie_input.fmt_omdb_url(),
                num = i
            ));
        }
        let search_results = future::join_all(search_urls.iter().map(|url| {
            // Concurrently make the requests, and extract releavant data. TODO: Handle possible Error Responses
            let client = &client;
            async move {
                match client.send_get_request::<OMDBSearchData>(url).await {
                    Ok(result) => match result.search {
                        Some(data) => data,
                        None => panic!(),
                    },
                    Err(_) => panic!(), // TODO: Add proper error handling
                }
            }
        }))
        .await;

        // convert search_results into a Vec<String> of urls to fetch details of
        let mut id_urls = Vec::new();
        search_results.iter().for_each(|results| {
            for result in results {
                id_urls.push(result.fmt_omdb_url())
            }
        });
        let movie_results = future::join_all(id_urls.iter().map(|url| {
            // Concurrently make the requests, and extract releavant data. TODO: Handle possible Error Responses
            let client = &client;
            async move {
                match client.send_get_request::<OMDbMovie>(url).await {
                    Ok(movie) => movie,
                    Err(_) => panic!(),
                }
            }
        }))
        .await;

        /* *
         * TODO:
         *  - update Movie fields and impl method of converting OMDbMovie to Movie
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
            pages: 1,
        };
        let test_omdb_search_result = OMDBSearchResult {
            imdb_id: String::from("tt0076759"),
        };

        let client = reqwest::Client::new();

        let (omdb_results_1, omdb_results_2) = tokio::join!(
            client.send_get_request::<OMDBSearchData>(test_search_movie_input.fmt_omdb_url()),
            client.send_get_request::<OMDbMovie>(test_omdb_search_result.fmt_omdb_url()),
        );
        println!("{:#?}", omdb_results_1);
        println!("{:#?}", omdb_results_2);
        match (omdb_results_1, omdb_results_2) {
            (Ok(result_1), Ok(result_2)) => (result_1, result_2),
            _ => panic!("Something went wrong with results"),
        };
    }
}
