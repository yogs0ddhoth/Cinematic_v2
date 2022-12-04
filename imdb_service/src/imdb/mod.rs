use crate::schema::AdvancedSearchData;
use std::env;
use reqwest;

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
        "https://imdb-api.com/API/AdvancedSearch/{key}/?title={title}&sort=moviemeter,asc",
        key = imdb_key,
        title = title
    );
    println!("{:#?} Fetching data...", url);

    let response = reqwest::get(url).await?;

    let movies = response.json::<AdvancedSearchData>().await?;

    Ok(movies)
}
