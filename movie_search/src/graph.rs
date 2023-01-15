use std::{env, num::ParseFloatError};

mod models;
use models::*;
mod omdb_models;
mod resolver;

use async_graphql::{InputObject, Object, SimpleObject};
use async_trait::async_trait;
use reqwest;
use serde;

use crate::auth::JwtGuard;

#[cfg(test)]
mod tests;

/// trait for formatting urls
trait FormatUrl {
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

/// trait for sending http requests
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

/// trait for resolving graphql queries
#[async_trait]
trait Resolver<T: for<'de> serde::Deserialize<'de>> {
    fn match_filters(&self, object: &T) -> Result<bool, ParseFloatError>;
    async fn search_movies(&self) -> Vec<T>;
}

/// graphql query object
pub struct Query;
#[Object]
impl Query {
    /// resolver for searchMovies
    #[graphql(guard = "JwtGuard {}")]
    async fn search_movies<'ctx>(&self, search_movie_input: SearchMovieInput) -> Vec<Movie> {
        let movies = search_movie_input.search_movies().await;
        movies.into_iter().map(|movie| Movie::from(movie)).collect()
    }

    /// entity recolver for MovieTrailers
    #[graphql(entity)]
    async fn find_movie_trailers_by_title<'a>(
        &self,
        #[graphql(key)] title: String,
    ) -> MovieTrailers {
        MovieTrailers::new(title)
    }
}
