mod imdb;

use imdb::{
    AdvancedSearchData, AdvancedSearchResult, call_imdb
};

use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use async_graphql::{EmptyMutation, EmptySubscription, Object, Schema, SimpleObject, ID};
use async_graphql_actix_web::{GraphQLRequest, GraphQLResponse};
use dotenvy::dotenv;
use reqwest;
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, env, error::Error, process::Termination};

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
