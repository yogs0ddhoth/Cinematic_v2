use actix_web::{guard, web, App, HttpRequest, HttpResponse, HttpServer};
use async_graphql::{
    http::{playground_source, GraphQLPlaygroundConfig},
    EmptyMutation, EmptySubscription, Schema,
};
use async_graphql_actix_web::{GraphQLRequest, GraphQLResponse};
use dotenvy::dotenv;

mod auth;
use auth::{Auth, Env};
mod graph;
use graph::Query;

async fn graphql_playground() -> HttpResponse {
    HttpResponse::Ok()
        .content_type("text/html; charset=utf-8")
        .body(playground_source(GraphQLPlaygroundConfig::new("/")))
}

fn get_auth_token(req: &HttpRequest) -> Option<String> {
    let auth_header = req
        .headers()
        .get("Authorization")?
        .to_str()
        .ok()?
        .trim_start_matches("Bearer ");
    Some(auth_header.to_string())
}

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
    dotenv().ok();
    /* Build Schema */
    let schema = Schema::build(Query, EmptyMutation, EmptySubscription)
        .data(Env::new())
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
