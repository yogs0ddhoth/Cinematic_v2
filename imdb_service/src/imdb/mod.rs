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
        "https://imdb-api.com/API/AdvancedSearch/{key}/?title={title}&title_type=feature,tv_movie,tv_special,documentary,short,tv_short&release_date={release_date}&genres={genres}&certificates={certificates}&user_rating={user_rating}&sort=moviemeter",
        key = imdb_key,
        title = search_input.title,
        release_date = search_input.release_date,
        genres = search_input.genres,
        certificates = search_input.certificates,
        user_rating = search_input.user_rating
    )
}

pub async fn call_imdb(search_movie_input: SearchMovieInput) -> Result<Vec<Movie>, reqwest::Error> {
    let url = fmt_url(search_movie_input);

    println!("{:#?} Fetching...", url);
    let response = match reqwest::get(url).await {
        Ok(data) => data,
        Err(e) => return Err(e.without_url()),
    };

    println!("Fetched! Serializing response...");
    let mut results = match response.json::<AdvancedSearchData>().await {
        Ok(data) => data.results,
        Err(e) => return Err(e.without_url()),
    };
    results.retain(
        // filter out results without a release date or genre
        |m| match m.description {
            Some(_) => match m.genre_list {
                Some(_) => true,
                None => false,
            },
            None => false,
        },
    );
    println!("Response Serialized. Sending data...");
    Ok(results)
}
