use std::{collections::HashMap, env};

use dotenvy::dotenv;
use reqwest;
use serde::{Deserialize, Serialize};

use async_graphql::{EmptyMutation, EmptySubscription, Object, Schema, SimpleObject, ID};

#[derive(Deserialize, Debug)]
pub struct AdvancedSearchData {
    pub queryString: Option<String>,
    pub results: Option<Vec<Movie>>,
    pub errorMessage: Option<String>,
}

#[derive(Deserialize, Debug, SimpleObject)]
pub struct Genre {
    pub key: String,
    pub value: String
}

#[derive(Deserialize, Debug, SimpleObject)]
pub struct Star {
    pub id: String,
    pub name: String
}

#[derive(Deserialize, Debug, SimpleObject)]
pub struct Movie {
    pub id: Option<String>,
    pub image: Option<String>,
    pub title: Option<String>,
    pub description: Option<String>,
    pub runtimeStr: Option<String>,
    pub genres: Option<String>,
    // pub genreList: Option<Vec<HashMap<String, String>>>,
    pub genreList: Option<Vec<Genre>>,
    pub contentRating: Option<String>,
    pub imDbRating: Option<String>,
    pub imDbRatingVotes: Option<String>,
    pub metacriticRating: Option<String>,
    pub plot: Option<String>,
    pub stars: Option<String>,
    // pub starList: Option<Vec<HashMap<String, String>>>,
    pub starList: Option<Vec<Star>>,
}

#[tokio::main]
pub async fn call_imdb(title: &str) -> Result<AdvancedSearchData, reqwest::Error> {
    dotenv().ok();
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
    println!("{:#?}", url);

    let response = reqwest::get(url).await?;

    let movies = response.json::<AdvancedSearchData>().await?;

    Ok(movies)
}
