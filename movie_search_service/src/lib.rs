pub mod imdb;
pub mod omdb;
pub mod schema;

use std::env;
use async_graphql::Object;
use reqwest;
use schema::{SearchMovieInput, Movie};

pub struct Query;

#[Object]
impl Query {
    async fn search_movies(
        &self,
        search_movie_input: SearchMovieInput,
    ) -> Result<Vec<Movie>, reqwest::Error> {
        let mut imdb_results = imdb::call_imdb(fmt_imdb_url(search_movie_input)).await;
        /* *
         * TODO: 
         * Implement async omdb search concurrently with imdb search
         *  - create new types 
         * combine results into new Vec<Movie>
         *  - update Movie fields
         *  - add new() impl method that combines OMDbMovie and IMDbMovie to make a new movie
         */
        Ok( /* Placeholder result */
            vec![Movie { id: todo!(), image: todo!(), title: todo!(), description: todo!(), runtime_str: todo!(), genre_list: todo!(), content_rating: todo!(), im_db_rating: todo!(), im_db_rating_votes: todo!(), metacritic_rating: todo!(), plot: todo!(), star_list: todo!() }]
        )
    }
}

pub fn fmt_imdb_url(search_input: SearchMovieInput) -> String {
    let imdb_key = match env::var("IMDB_KEY") {
        Ok(data) => data,
        Err(data) => {
            println!("Error getting Imdb Key: {:#?}", data);
            String::from("ERROR_NO_KEY")
        }
    };
    format!(
        "https://imdb-api.com/API/AdvancedSearch/{key}/?title={title}&title_type=feature,tv_movie,tv_special,documentary,short,tv_short&release_date={release_date}&genres={genres}&certificates={certificates}&user_rating={user_rating}&sort=moviemeter",
        key = imdb_key,
        title = search_input.title,
        release_date = search_input.release_date,
        genres = search_input.genres,
        certificates = search_input.certificates,
        user_rating = search_input.user_rating
    )
}

// fn fmt_omdb_url

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

        match imdb::call_imdb(fmt_imdb_url(test_input)).await {
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

        assert_eq!(fmt_imdb_url(test_input), "https://imdb-api.com/API/AdvancedSearch/ERROR_NO_KEY/?title=&release_date=&genres=&certificates=&user_rating=&sort=moviemeter,desc".to_string())
    }
}
