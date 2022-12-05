use crate::schema::{AdvancedSearchData, Movie, SearchMovieInput};
use reqwest;
use std::env;

pub fn fmt_url(search_input: SearchMovieInput) -> String {
    let imdb_key = match env::var("IMDB_KEY") {
        Ok(data) => data,
        Err(data) => {
            println!("Error getting Imdb Key: {:#?}", data);
            String::from("ERROR_NO_KEY")
        }
    };
    format!(
        "https://imdb-api.com/API/AdvancedSearch/{key}/?title={title}&release_date={release_date}&genres={genres}&certificates={certificates}&user_rating={user_rating}&sort=moviemeter,desc",
        key = imdb_key,
        title = search_input.title,
        release_date = search_input.releaseDate,
        genres = search_input.genres,
        certificates = search_input.certificates,
        user_rating = search_input.userRating
    )
}

pub async fn call_imdb(searchMovieInput: SearchMovieInput) -> Result<Vec<Movie>, reqwest::Error> {
    let url = fmt_url(searchMovieInput);

    println!("{:#?} Fetching...", url);
    let response = match reqwest::get(url).await {
        Ok(data) => data,
        Err(e) => return Err(e.without_url()),
    };

    println!("Fetched! Serializing response...");
    let results = match response.json::<AdvancedSearchData>().await {
        Ok(data) => data.results,
        Err(e) => return Err(e.without_url()),
    };

    println!("Response Serialized. Sending data...");
    Ok(results)
}
