pub mod imdb;
pub mod omdb;
pub mod schema;

use std::{env, borrow::Borrow, result};
use async_graphql::Object;
use omdb::{OMDbMovie, OMDBSearchData};
use reqwest;
use serde;
use schema::{SearchMovieInput, Movie};
use tokio;

pub struct Query;

#[Object]
impl Query {
    async fn search_movies(
        &self,
        search_movie_input: SearchMovieInput,
    ) -> Result<Vec<Movie>, reqwest::Error> {
        // let mut imdb_results = imdb::call_imdb(fmt_imdb_url(search_movie_input)).await;
        let omdb_search_url = fmt_omdb_search_url(&search_movie_input, "s");
        
        let client = reqwest::Client::new();
        // let movies = Vec::new();
        {
            let (mut omdb_results_1, mut omdb_results_2) = tokio::join!(
                send_get::<OMDBSearchData>(omdb_search_url.clone(), client.borrow(), ),
                send_get::<OMDBSearchData>(omdb_search_url.clone() + "&page=2", client.borrow()),
            );
    
            let ids = match (omdb_results_1, omdb_results_2) {
                (Ok(results_1), Ok(results_2)) => match (results_1.search, results_2.search) {
                    (Some(mut s1), Some(mut s2)) => {
                        s1.append(&mut s2);
                        s1
                    }
                    (Some(s1), None) => s1,
                    (None, Some(s2)) => s2,
                    _ => Vec::new() // needs a better solution

                }
                (Err(e), _) => return Err(e),
                (Ok(_), Err(e)) => return Err(e),
            };
        }
        /* *
         * TODO: 
         *  - combine omdb_results_1 and omdb_results_2 in to a vector of type OMDBSearchResult
         *  - call async omdb searches of element of the new vector
         * combine results into new Vec<Movie>
         *  - update Movie fields
         *  - add new() impl method that combines OMDbMovie and IMDbMovie to make a new movie
         */
        Ok( /* Placeholder result */
            vec![Movie { imdb_id: todo!(), image: todo!(), title: todo!(), description: todo!(), runtime_str: todo!(), genre_list: todo!(), content_rating: todo!(), im_db_rating: todo!(), im_db_rating_votes: todo!(), metacritic_rating: todo!(), plot: todo!(), star_list: todo!() }]
        )
    }
}

pub fn fmt_imdb_url(search_input: SearchMovieInput) -> String {
    let imdb_key = match env::var("IMDB_KEY") {
        Ok(data) => data,
        Err(data) => {
            println!("Error getting IMDb Key: {:#?}", data);
            String::from("ERROR_NO_KEY")
        }
    };
    format!(
        "https://imdb-api.com/API/AdvancedSearch/{key}/?title={title}&title_type=feature,tv_movie,tv_special,documentary,short,tv_short&release_date={release_date}&genres={genres}&certificates={certificates}&user_rating={user_rating}&sort=moviemeter",
        key = imdb_key,
        title = search_input.title,
        release_date = search_input.release_year,
        genres = search_input.genres,
        certificates = search_input.certificates,
        user_rating = search_input.user_rating
    )
}

pub fn fmt_omdb_search_url(search_input: &SearchMovieInput, search_type: &str) -> String {
    let omdb_key = match env::var("OMDB_KEY") {
        Ok(data) => data,
        Err(data) => {
            println!("Error getting OMDb Key: {:#?}", data);
            String::from("ERROR_NO_KEY")
        }
    };
    format!(
        "https://www.omdbapi.com/?apikey={key}&{search_type}={title}&y={year}",
        key = omdb_key,
        search_type = search_type,
        title = search_input.title,
        year = search_input.release_year,
    )
}

/// build and send GET request to url, deserialize response to type parameter, and return results
pub async fn send_get<T: for<'de> serde::Deserialize<'de>>(url: String, client: &reqwest::Client) -> Result<T, reqwest::Error> 
{
    println!("{:#?} Fetching...", url);
    let response = match client
        .get(url)
        .send()
        .await {
        Ok(data) => data,
        Err(e) => return Err(e.without_url()),
    };

    println!("Fetched! Serializing response...");
    let results = match response.json::<T>().await {
        Ok(data) => data,
        Err(e) => return Err(e.without_url()),
    };

    println!("Response Serialized. Sending data...");
    Ok(results)
}

#[cfg(test)]
mod tests {
    use super::*;
    use dotenvy::dotenv;

    #[tokio::test]
    async fn call_imdb_works() {
        dotenv().ok();

        let test_input = SearchMovieInput {
            title: String::from("Inception"),
            certificates: String::default(),
            genres: String::default(),
            release_year: String::default(),
            user_rating: String::default(),
        };

        match imdb::call_imdb(fmt_imdb_url(test_input)).await {
            Ok(data) => println!("{:#?}", data),
            Err(data) => println!("{:#?}", data),
        }
    }

    /// test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 2 filtered out; finished in 0.32s
    #[tokio::test]
    async fn get_requests_work() {
        dotenv().ok();

        let test_input = SearchMovieInput {
            title: String::from("Inception"),
            certificates: String::default(),
            genres: String::default(),
            release_year: String::default(),
            user_rating: String::default(),
        };
        
        let client = reqwest::Client::new();

        let (omdb_results_1, omdb_results_2) = tokio::join!(
            send_get::<OMDBSearchData>(fmt_omdb_search_url(&test_input, "s"), client.borrow()),
            send_get::<OMDbMovie>(fmt_omdb_search_url(&test_input, "t"), client.borrow()),
        );
        println!("{:#?}", omdb_results_1);
        println!("{:#?}", omdb_results_2);
        match (omdb_results_1, omdb_results_2) {
            (Ok(result_1), Ok(result_2)) => (result_1, result_2),
            _ => panic!("Something went wrong with results")

        };
    }

    #[test]
    fn fmt_url_works() {
        /* simulates the #[graphql(default)] for each field */
        let test_input = SearchMovieInput {
            title: String::default(),
            certificates: String::default(),
            genres: String::default(),
            release_year: String::default(),
            user_rating: String::default(),
        };

        assert_eq!(fmt_imdb_url(test_input), "https://imdb-api.com/API/AdvancedSearch/ERROR_NO_KEY/?title=&release_date=&genres=&certificates=&user_rating=&sort=moviemeter,desc".to_string())
    }
}
