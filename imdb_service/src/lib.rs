mod imdb;
// mod schema;

use imdb::{call_imdb, AdvancedSearchData, Movie};
// use schema::{};

use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use async_graphql::{EmptyMutation, EmptySubscription, Object, Schema, SimpleObject, ID};
use async_graphql_actix_web::{GraphQLRequest, GraphQLResponse};

use std::{
    clone,
    // collections::HashMap,
    // env,
    error::Error,
    process::Termination,
};

pub struct Query;

#[Object]
impl Query {
    async fn search(&self) -> Vec<Movie> {
        let mut results: Vec<Movie> = Vec::new();
        let response = call_imdb("inception");
        match response {
            Ok(data) => match data.results {
                Some(mut data) => {
                    results.append(&mut data);
                    results
                }
                None => results,
            },
            Err(data) => {
                println!("Error getting Imdb data: {:#?}", data);
                results
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn call_api_works() {
        let movies = call_imdb("inception");

        match movies {
            Ok(data) => println!("{:#?}", data),
            Err(data) => println!("{:#?}", data),
        }
    }
}
