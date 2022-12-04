pub mod imdb;
pub mod schema;

use schema::{
    AdvancedSearchData,
    Movie,
    SearchInput
};
use async_graphql::Object;
use reqwest::{self, Error};

pub struct Query;

#[Object]
impl Query {
    async fn search(&self, searchInput: SearchInput) -> Result<Vec<Movie>, Error> {
        let url = imdb::fmt_imdb_url(searchInput);
        println!("{:#?} Fetching data...", url);

        let response = match reqwest::get(url).await {
            Ok(data) => data,
            Err(e) => return Err(e.without_url())
        };
            
        let results = match response.json::<AdvancedSearchData>().await {
            Ok(data) => data.results,
            Err(e) => return Err(e.without_url())
        };
        
        println!("Response Serialized. Sending data...");
        Ok(results)
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
