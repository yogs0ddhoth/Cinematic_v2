use actix_web::{guard, web, App, HttpResponse, HttpServer};
use async_graphql::{
    http::{playground_source, GraphQLPlaygroundConfig},
    EmptyMutation, EmptySubscription, Schema,
};
use async_graphql_actix_web::{GraphQLRequest, GraphQLResponse};
use dotenvy::dotenv;

use movie_search_service::Query;

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
    /* Configure URL */
    let port = 4003;
    let address = match std::env::var("PROCESS") {
        Ok(process) => match process.as_str() {
            "PRODUCTION" => "0.0.0.0",
            _ => "127.0.0.1",
        },
        _ => "127.0.0.1",
    };
    println!("Listening at: http://{address}:{port}");

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(schema.clone()))
            .service(
                web::resource("/")
                    .guard(guard::Get())
                    .to(graphql_playground),
            )
            .service(web::resource("/").guard(guard::Post()).to(index))
    })
    .bind((address, port))?
    .run()
    .await
}
