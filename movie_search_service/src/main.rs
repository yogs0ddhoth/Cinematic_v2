use std::{env, fs, num::ParseFloatError};

use actix_web::{guard, web, App, HttpResponse, HttpServer};
use async_graphql::{
    http::{playground_source, GraphQLPlaygroundConfig},
    EmptyMutation, EmptySubscription, Schema,
};
use async_graphql_actix_web::{GraphQLRequest, GraphQLResponse};
use async_trait::async_trait;
use dotenvy::dotenv;
use reqwest;
use serde;

pub mod resolvers;
use resolvers::Query;

// #[cfg(test)]
// mod tests;

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
pub trait Search<T: for<'de> serde::Deserialize<'de>> {
    fn match_filters(&self, object: &T) -> Result<bool, ParseFloatError>;
    async fn search_movies(&self) -> Vec<T>;
}

async fn index(
    schema: web::Data<Schema<Query, EmptyMutation, EmptySubscription>>,
    request: GraphQLRequest,
) -> GraphQLResponse {
    schema.execute(request.into_inner()).await.into()
}

async fn graphql_playground() -> HttpResponse {
    HttpResponse::Ok()
        .content_type("text/html; charset=utf-8")
        .body(playground_source(GraphQLPlaygroundConfig::new("/")))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    /* Build Schema */
    let schema = Schema::build(Query, EmptyMutation, EmptySubscription)
        .enable_federation()
        .finish();
    fs::write("schema.graphql", &schema.sdl()).unwrap();
    /* Configure URL */
    let port = 4003;
    let address = match std::env::var("PROCESS") {
        Ok(process) => match process.as_str() {
            "PRODUCTION" => "0.0.0.0",
            _ => "127.0.0.1",
        },
        _ => "127.0.0.1",
    };
    println!("Listening at: http://{address}:{port}/graphql");

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(schema.clone()))
            .service(
                web::resource("/graphql")
                    .guard(guard::Get())
                    .to(graphql_playground),
            )
            .service(web::resource("/graphql").guard(guard::Post()).to(index))
    })
    .bind((address, port))?
    .run()
    .await
}
