pub mod imdb;
pub mod schema;

use async_graphql::Object;
use reqwest;
use schema::{Movie, SearchMovieInput};

pub struct Query;

#[Object]
impl Query {
    async fn search_movies(
        &self,
        search_movie_input: SearchMovieInput,
    ) -> Result<Vec<Movie>, reqwest::Error> {
        imdb::call_imdb(search_movie_input).await
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use async_std;
    use dotenvy::dotenv;

    #[async_std::test]
    async fn call_imdb_works() {
        dotenv().ok();

        let test_input = SearchMovieInput {
            title: String::from("Inception"),
            certificates: String::default(),
            genres: String::default(),
            release_date: String::default(),
            user_rating: String::default(),
        };

        match imdb::call_imdb(test_input).await {
            Ok(data) => println!("{:#?}", data),
            Err(data) => println!("{:#?}", data),
        }
    }

    #[test]
    fn fmt_url_works() {
        /* simulates the #[graphql(default)] for each field */
        let test_input = SearchMovieInput {
            title: String::default(),
            certificates: String::default(),
            genres: String::default(),
            release_date: String::default(),
            user_rating: String::default(),
        };

        assert_eq!(imdb::fmt_url(test_input), "https://imdb-api.com/API/AdvancedSearch/ERROR_NO_KEY/?title=&release_date=&genres=&certificates=&user_rating=&sort=moviemeter,desc".to_string())
    }
}
