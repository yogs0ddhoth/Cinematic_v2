pub mod graph;
pub mod models;

use super::{async_trait, reqwest, FormatUrl, ParseFloatError, Request, Search};
use async_graphql::Object;
use futures::{stream, StreamExt};
use graph::{Movie, MovieTrailers, SearchRatingInput, SearchMovieInput};
use models::{OMDbMovie, OMDbSearchData};
use std::collections::{HashMap, HashSet};

pub struct Query;
#[Object]
impl Query {
    async fn search_movies(&self, search_movie_input: SearchMovieInput) -> Vec<Movie> {
        let movies = search_movie_input.search_movies().await;
        movies.into_iter().map(|movie| Movie::from(movie)).collect()
    }

    #[graphql(entity)]
    async fn find_movie_trailers_by_title<'a>(
        &self,
        #[graphql(key)] title: String,
    ) -> MovieTrailers {
        MovieTrailers::new(title)
    }
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
        // maximum number of concurrent requests
        const MAX_CONCURRENT_REQUESTS: usize = 50;

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
impl Search<OMDbMovie> for SearchMovieInput {
    /// Apply search filters, if defined, to movie
    /// Returns true if the movie matches filters
    fn match_filters(&self, movie: &OMDbMovie) -> Result<bool, ParseFloatError> {
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
                        return Ok(false)
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

    async fn search_movies(&self) -> Vec<OMDbMovie> {
        let client = reqwest::Client::new();
        let mut id_urls = Vec::new();
        {
            // Search OMDB for all movies that match search_movie_input, and push the information to id_urls
            let mut search_urls = Vec::new();
            for i in 1..self.pages + 1 {
                // for pagination
                // push urls for each page (see omdb api) to search_urls
                search_urls.push(format!(
                    "{url}&page={num}",
                    url = self.fmt_omdb_url(),
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
                        Ok(data) => match data.search() {
                            Some(result_page) => {
                                for result in result_page {
                                    id_urls.push(result.fmt_omdb_url())
                                }
                            }
                            None => match data.error() {
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
                        // Handle Error responses and apply search filters
                        Ok(movie) => match self.match_filters(&movie) {
                            Ok(bool) => {
                                if bool {
                                    movies.push(movie)
                                }
                            }
                            Err(err) => {
                                println!("Error parsing fields: {:#?}", err);
                            }
                        },
                        Err(err) => println!("Found an Error: {:#?}", err),
                    }
                });
        }
        println!("Done! Sending response...");
        movies
    }
}
