use super::{async_trait, reqwest, schema::SearchMovieInput, serde, Request};
use futures::{stream, StreamExt};

use crate::{Filter, FormatUrl};

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
    pub year: Option<String>,
    pub released: Option<String>,
    pub rated: Option<String>,
    pub runtime: Option<String>,

    pub director: Option<String>,
    pub writer: Option<String>,
    pub actors: Option<String>,

    pub plot: Option<String>,
    pub genre: Option<String>,

    pub language: Option<String>,
    pub country: Option<String>,
    pub awards: Option<String>,
    pub poster: Option<String>,

    pub ratings: Option<Vec<OMDbRating>>,
    pub metascore: Option<String>,
    #[serde(rename = "imdbRating")]
    pub imdb_rating: Option<String>,
    #[serde(rename = "imdbVotes")]
    pub imdb_votes: Option<String>,

    pub box_office: Option<String>,
    pub production: Option<String>,

    // api specific information
    pub response: String,
}

// maximum number of concurrent requests
const MAX_CONCURRENT_REQUESTS: usize = 50;

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

#[async_trait]
pub trait Search<T>
where
    T: FormatUrl + Filter<OMDbMovie>,
{
    async fn get_omdb_movies(search_movie_input: T) -> Vec<OMDbMovie>;
}
#[async_trait]
impl Search<SearchMovieInput> for OMDbMovie {
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
                        Ok(movie) => {
                            if search_movie_input.match_filters(&movie) {
                                movies.push(movie)
                            }
                        }
                        Err(err) => println!("Found an Error: {:#?}", err),
                    }
                });
        }
        println!("Done! Sending response...");
        movies
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
