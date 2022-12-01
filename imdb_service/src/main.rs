use actix_web::{guard, web, App, HttpResponse, HttpServer, Responder};
use async_graphql::{EmptyMutation, EmptySubscription, Object, Schema, SimpleObject, ID};
use async_graphql_actix_web::{GraphQLRequest, GraphQLResponse};
use dotenvy::dotenv;
use reqwest;
use std::{collections::HashMap, env, error::Error};

use imdb_service::Query;

async fn index(
    schema: web::Data<Schema<Query, EmptyMutation, EmptySubscription>>,
    request: GraphQLRequest,
) -> GraphQLResponse {
    schema.execute(request.into_inner()).await.into()
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let schema = Schema::build(Query, EmptyMutation, EmptySubscription).finish();

    HttpServer::new(move || {
        App::new().app_data(web::Data::new(schema.clone())).service(
            web::resource("/graphql/movies")
                .guard(guard::Get())
                .to(index),
        )
    })
    .bind("127.0.0.1:4001")?
    .run()
    .await
}
