pub mod imdb;

use imdb::{
    AdvancedSearchData,
    Movie
};
use async_graphql::Object;

use std::env;
use reqwest;

pub struct Query;

#[Object]
impl Query {
    async fn search(&self, ) -> Vec<Movie> {
        let env_imdb_key = env::var("IMDB_KEY");
        let imdb_key = match env_imdb_key {
            Ok(data) => data,
            Err(data) => {
                println!("Error getting Imdb Key: {:#?}", data);
                data.to_string()
            }
        };
        let url = format!(
            "https://imdb-api.com/API/AdvancedSearch/{key}/?title={title}&sort=moviemeter,asc",
            key = imdb_key,
            title = "inception"
        );
        println!("{:#?} Fetching data...", url);

        match reqwest::get(url).await {
            Ok(response) => {
                println!("Data fetched! Serializing JSON...");

                match response.json::<AdvancedSearchData>().await {
                    Ok(json) => {
                        println!("JSON Serialized! Sending data...");

                        match json.results {
                            Some(data) => data,
                            None => {
                                println!("No Results!");
                                return Vec::<Movie>::new();
                            }
                        }
                    }
                    Err(data) => {
                        println!("Error getting Imdb data: {:#?}", data);
                        return Vec::<Movie>::new();
                    }
                }
            }
            Err(data) => {
                println!("Error getting Imdb data: {:#?}", data);
                return Vec::<Movie>::new();
            }
        }
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
