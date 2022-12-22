pub mod imdb;
pub mod omdb;
pub mod schema;

use async_graphql::Object;
use async_trait::async_trait;
use futures::future;
use omdb::{OMDBSearchData, OMDBSearchResult, OMDbMovie};
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
                .send_many_get_requests::<OMDBSearchData>(search_urls)
                .await
                .iter()
                .for_each(|results| {
                    // Filter out error responses and convert search_results into imdb ids of type String and push to id_urls
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
                .iter()
                .for_each(|result| {
                    // Filter out error responses and push OMDbMovie to movies
                    println!("Filtering results...");
                    match result {
                        Ok(movie) => movies.push(movie),
                        Err(err) => println!("Found an Error: {:#?}", err),
                    }
                });
        }

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
impl FormatUrl for OMDBSearchResult {
    fn fmt_omdb_url(&self) -> String {
        format!(
            "https://www.omdbapi.com/?apikey={key}&i={id}",
            key = self.get_omdb_key(),
            id = self.imdb_id,
        )
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use dotenvy::dotenv;
    use tokio;

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
        let test_search_movie_url = test_search_movie_input.fmt_omdb_url();

        let test_omdb_search_result = OMDBSearchResult {
            imdb_id: String::from("tt0076759"),
        };
        let test_omdb_search_url = test_omdb_search_result.fmt_omdb_url();

        let client = reqwest::Client::new();

        let (omdb_results_1, omdb_results_2) = tokio::join!(
            client.send_get_request::<OMDBSearchData>(&test_search_movie_url),
            client.send_get_request::<OMDbMovie>(&test_omdb_search_url),
        );
        println!("{:#?}", omdb_results_1);
        println!("{:#?}", omdb_results_2);
        match (omdb_results_1, omdb_results_2) {
            (Ok(result_1), Ok(result_2)) => (result_1, result_2),
            _ => panic!("Something went wrong with results"),
        };
    }
}
