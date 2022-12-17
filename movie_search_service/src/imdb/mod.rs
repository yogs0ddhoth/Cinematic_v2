use reqwest;
use serde;

#[derive(serde::Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct AdvancedSearchData {
    pub query_string: Option<String>,
    pub results: Vec<IMDbMovie>,
    pub error_message: Option<String>,
}

#[derive(serde::Deserialize, Debug)]
pub struct IMDbGenre {
    value: String,
}

#[derive(serde::Deserialize, Debug)]
pub struct IMDbStar {
    name: String,
}

#[derive(serde::Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct IMDbMovie {
    pub id: Option<String>,
    pub image: Option<String>,
    pub title: Option<String>,
    pub description: Option<String>,
    pub runtime_str: Option<String>,
    pub genre_list: Option<Vec<IMDbGenre>>,
    pub content_rating: Option<String>,
    pub im_db_rating: Option<String>,
    pub im_db_rating_votes: Option<String>,
    pub metacritic_rating: Option<String>,
    pub plot: Option<String>,
    pub star_list: Option<Vec<IMDbStar>>,
}

pub async fn call_imdb(url: String) -> Result<Vec<IMDbMovie>, reqwest::Error> {
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
