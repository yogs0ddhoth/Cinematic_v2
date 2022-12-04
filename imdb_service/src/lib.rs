pub mod imdb;
pub mod schema;

use schema::{
    AdvancedSearchData,
    Movie
};
use async_graphql::Object;

use std::env;
use reqwest::{self, Error};

pub struct Query;

#[Object]
impl Query {
    async fn search(&self, ) -> Result<Vec<Movie>, Error> {
        let imdb_key = match env::var("IMDB_KEY") {
            Ok(data) => data,
            Err(data) => {
                println!("Error getting Imdb Key: {:#?}", data);
                String::from("no-key-initialized")
            }
        };
        let url = format!(
            "https://imdb-api.com/API/AdvancedSearch/{key}/?title={title}&sort=moviemeter,asc",
            key = imdb_key,
            title = "inception"
        );
        println!("{:#?} Fetching data...", url);
        let response = reqwest::get(url).await?
            .json::<AdvancedSearchData>().await?;
        
        println!("Response Serialized. Sending data...");
        Ok(response.results)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use dotenvy::dotenv;

    #[test]
    fn call_imdb_works() {
        dotenv().ok();
        let movies = imdb::call_imdb("inception");

        match movies {
            Ok(data) => println!("{:#?}", data),
            Err(data) => println!("{:#?}", data),
        }
    }
}
