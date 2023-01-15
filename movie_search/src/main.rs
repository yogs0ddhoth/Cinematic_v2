use actix_web::{guard, web, App, HttpRequest, HttpResponse, HttpServer};
use async_graphql::{
    http::{playground_source, GraphQLPlaygroundConfig},
    EmptyMutation, EmptySubscription, Schema,
};
use async_graphql_actix_web::{GraphQLRequest, GraphQLResponse};
use dotenvy;
use futures::{self, StreamExt};
use getset;
use reqwest;
use serde;

mod auth;
use auth::Auth;

mod graph;
use graph::Query;

#[derive(Debug, getset::Getters)]
pub struct Env {
    #[getset(get = "pub")]
    secret_key: String,

    #[getset(get = "pub")]
    omdb_key: String,
}
impl Env {
    pub fn new() -> Self {
        Env {
            secret_key: std::env::var("SECRET_KEY").unwrap(),
            omdb_key: std::env::var("OMDB_KEY").unwrap(),
        }
    }
}

/// trait for sending http requests
#[async_trait::async_trait]
pub trait Request {
    async fn send_get_request<T: for<'de> serde::Deserialize<'de>>(
        &self,
        url: &String,
    ) -> Result<T, reqwest::Error>;

    async fn send_many_get_requests<T: for<'de> serde::Deserialize<'de> + std::marker::Send>(
        &self,
        urls: Vec<String>,
    ) -> Vec<Result<T, reqwest::Error>>;
}
#[async_trait::async_trait]
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

        futures::stream::iter(
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

async fn graphql_playground() -> HttpResponse {
    HttpResponse::Ok()
        .content_type("text/html; charset=utf-8")
        .body(playground_source(GraphQLPlaygroundConfig::new("/")))
}

/// Extracts the Authorization header from the request and returns the token
fn get_auth_token(req: &HttpRequest) -> Option<String> {
    let auth_header = req
        .headers()
        .get("Authorization")?
        .to_str()
        .ok()?
        .trim_start_matches("Bearer ");
    Some(auth_header.to_string())
}

/// GraphQL endpoint
async fn index(
    schema: web::Data<Schema<Query, EmptyMutation, EmptySubscription>>,
    req: HttpRequest,
    gql_req: GraphQLRequest,
) -> GraphQLResponse {
    let mut request = gql_req.into_inner();
    request = request.data(Auth::new(get_auth_token(&req)));

    schema.execute(request).await.into()
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenvy::dotenv().ok();
    /* Build Schema */
    let schema = Schema::build(Query, EmptyMutation, EmptySubscription)
        .data(Env::new())
        .data(reqwest::Client::new())
        .enable_federation()
        .finish();

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
