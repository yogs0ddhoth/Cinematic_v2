#[cfg(test)]
mod tests {
  use async_graphql::{EmptyMutation, EmptySubscription, Object, Schema, SimpleObject, ID};
  use async_graphql_actix_web::{GraphQLRequest, GraphQLResponse};
  use actix_web::{web, App, HttpResponse, HttpServer, Responder};
  use dotenvy::dotenv;
  use std::{env, collections::HashMap, error::Error};
  use reqwest;
  use serde::{Deserialize, Serialize};

  #[derive(Deserialize, Debug)]
  pub struct AdvancedSearchData {
    pub queryString: Option<String>,
    pub results: Option<Vec<AdvancedSearchResult>>,
    pub errorMessage: Option<String>,
  }
  #[derive(Deserialize, Debug)]
  pub struct AdvancedSearchResult {
    pub id: Option<String>,
    pub image: Option<String>,
    pub title: Option<String>,
    pub description: Option<String>,
    pub runtimeStr: Option<String>,
    pub genres: Option<String>,
    pub genreList: Option<Vec<HashMap<String, String>>>,
    pub contentRating: Option<String>,
    pub imDbRating: Option<String>,
    pub imDbRatingVotes: Option<String>,
    pub metacriticRating: Option<String>,
    pub plot: Option<String>,
    pub stars: Option<String>,
    pub starList: Option<Vec<HashMap<String, String>>>,
  }
  
  #[tokio::main]
  #[test]
  async fn api_call_works() -> Result<(), Box<dyn Error>> {
      dotenv().ok();
      let imdb_key = env::var("IMDB_KEY")?;
      println!("{:#?}", imdb_key);

      let url = format!("https://imdb-api.com/API/AdvancedSearch/{key}/?title={title}&sort=moviemeter,asc", key=imdb_key, title="inception");
      println!("{:#?}", url);

      let response = reqwest::get(url).await?;
      println!("{:#?}", response);

      let movies = response.json::<AdvancedSearchData>().await?;
      println!("{:?}", movies);
      Ok(())
  }
}