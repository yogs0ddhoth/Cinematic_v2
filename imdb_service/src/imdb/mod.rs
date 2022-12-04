use crate::schema::{AdvancedSearchData, SearchInput};
use std::env;
use reqwest;

pub fn fmt_url(search_input: SearchInput) -> String {
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

/* external api call for unit testing */
#[tokio::main]
pub async fn call_imdb(title: &str) -> Result<AdvancedSearchData, reqwest::Error> {
    let env_imdb_key = env::var("IMDB_KEY");
    let imdb_key = match env_imdb_key {
        Ok(data) => data,
        Err(data) => {
            println!("Error getting Imdb Key: {:#?}", data);
            data.to_string()
        }
    };

    let url = format!(
        "https://imdb-api.com/API/AdvancedSearch/{key}/?title={title}&release_date={release_date}&genres={genres}&certificates={certificates}&sort=moviemeter,desc",
        key = imdb_key,
        title = "inception",
        release_date = "",
        genres = "",
        certificates = ""
    );
    println!("{:#?} Fetching data...", url);

    let response = reqwest::get(url).await?;

    let movies = response.json::<AdvancedSearchData>().await?;

    Ok(movies)
}
