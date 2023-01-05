use super::*;
use crate::resolvers::{
    graph::{Movie, RatingInput, SearchMovieInput},
    models::{OMDbMovie, OMDbMovieBuilder, OMDbRatingBuilder, OMDbSearchData, OMDbSearchResult},
};
use dotenvy::dotenv;
use tokio;

#[test]
fn fmt_omdb_url_works() {
    let test_search_movie_input = SearchMovieInput {
        title: String::from("Star%20Wars"),
        release_year: String::new(),
        pages: 1,
        content_rating: None,
        director: None,
        genres: None,
        ratings: None,
        writers: None,
    };
    let test_omdb_search_result = OMDbSearchResult::new("tt0076759".to_string());

    let test_omdb_search_url = test_omdb_search_result.fmt_omdb_url();
    let test_search_movie_url = test_search_movie_input.fmt_omdb_url();

    assert_eq!(
        "https://www.omdbapi.com/?apikey=NO_KEY&s=Star%20Wars&y=",
        test_search_movie_url
    );
    assert_eq!(
        "https://www.omdbapi.com/?apikey=NO_KEY&i=tt0076759",
        test_omdb_search_url
    );
}

#[tokio::test]
async fn get_requests_work() {
    dotenv().ok();

    let test_search_movie_input = SearchMovieInput {
        title: String::from("Star%20Wars"),
        release_year: String::new(),
        ratings: None,
        pages: 1,
        content_rating: None,
        director: None,
        genres: None,
        writers: None,
    };
    let test_search_movie_url = test_search_movie_input.fmt_omdb_url();

    let test_omdb_search_result = OMDbSearchResult::new("tt0076759".to_string());
    let test_omdb_search_url = test_omdb_search_result.fmt_omdb_url();

    let client = reqwest::Client::new();

    let (omdb_results_1, omdb_results_2) = tokio::join!(
        client.send_get_request::<OMDbSearchData>(&test_search_movie_url),
        client.send_get_request::<OMDbMovie>(&test_omdb_search_url),
    );

    match (omdb_results_1, omdb_results_2) {
        (Ok(result_1), Ok(result_2)) => {
            assert!(result_1.search().is_some());
            assert!(result_2.imdb_id() == "tt0076759");
        }
        (Ok(_), Err(err)) => {
            println!("Caught Error: {:#?}", err);
            panic!("Request Errors");
        }
        (Err(err), Ok(_)) => {
            println!("Caught Error: {:#?}", err);
            panic!("Request Errors");
        }
        (Err(err_1), Err(err_2)) => {
            println!("Caught Errors: {:#?}, {:#?}", err_1, err_2);
            panic!("Request Errors");
        }
    };
}

#[tokio::test]
async fn many_get_requests_work() {
    dotenv().ok();

    let test_search_movie_input = SearchMovieInput {
        title: String::from("Star%20Wars"),
        release_year: String::new(),
        ratings: Some(vec![
            RatingInput {
                source: String::from("Metacritic"),
                score: 60.0,
            },
            RatingInput {
                source: String::from("Internet Movie Database"),
                score: 6.0,
            },
            RatingInput {
                source: String::from("Rotten Tomatoes"),
                score: 60.0,
            },
        ]),
        pages: 3,
        content_rating: Some(vec![String::from("PG"), String::from("PG-13")]),
        director: None,
        genres: Some(vec![
            String::from("Action"),
            String::from("Adventure"),
            String::from("Fantasy"),
        ]),
        writers: None,
    };
    let client = reqwest::Client::new();

    let mut id_urls = Vec::new();
    {
        // Search OMDB for all movies that match search_movie_input, and push the information to id_urls
        let mut search_urls = Vec::new();
        for i in 1..test_search_movie_input.pages + 1 {
            search_urls.push(format!(
                "{url}&page={num}",
                url = test_search_movie_input.fmt_omdb_url(),
                num = i
            ));
        }
        assert!(search_urls.len() == 3);

        // concurrently send requests for each of the urls
        client
            .send_many_get_requests::<OMDbSearchData>(search_urls)
            .await
            .iter()
            .for_each(|results| {
                // Filter out error responses and convert search_results into imdb ids of type String and push to id_urls
                match results {
                    Ok(data) => match data.search() {
                        Some(result_page) => {
                            for result in result_page {
                                id_urls.push(result.fmt_omdb_url())
                            }
                        }
                        None => match data.error() {
                            Some(err) => {
                                panic!("Found a Request Error: {:#?}", err);
                            }
                            None => panic!("Request Errors: No Result found."),
                        },
                    },
                    Err(err) => {
                        panic!("Found a Request Error: {:#?}", err);
                    }
                }
            });
    }
    // this request should produce results
    assert!(id_urls.len() == 30);

    let mut movies = Vec::new();
    {
        // concurrently send requests for each of the id url
        client
            .send_many_get_requests::<OMDbMovie>(id_urls)
            .await
            .into_iter()
            .for_each(|result| {
                match result {
                    // Handle Error responses and apply search filters
                    Ok(movie) => match test_search_movie_input.match_filters(&movie) {
                        Ok(bool) => {
                            if bool {
                                println!("{:#?}", movie);
                                movies.push(movie)
                            }
                        }
                        Err(err) => {
                            println!("Error parsing fields: {:#?}", err);
                        }
                    },
                    Err(err) => {
                        panic!("Found a Request Error: {:#?}", err);
                    }
                }
            });
    }
    // assert!(movies.len() > 0);
    println!("{:#?}", movies);
}

#[tokio::test]
async fn match_filters_works() {
    dotenv().ok();

    let test_search_movie_input = SearchMovieInput {
        title: String::new(),
        release_year: String::new(),
        ratings: Some(vec![
            RatingInput {
                source: "Metacritic".to_string(),
                score: 80.0,
            },
            RatingInput {
                source: "Internet Movie Database".to_string(),
                score: 8.0,
            },
            RatingInput {
                source: "Rotten Tomatoes".to_string(),
                score: 80.0,
            },
        ]),
        pages: 1,
        content_rating: Some(vec![
            "PG".to_string(), 
            "PG-13".to_string(),
        ]),
        director: Some("George Lucas".to_string()),
        genres: Some(vec![
            "Action".to_string(),
            "Adventure".to_string(),
            "Fantasy".to_string()
        ]),
        writers: Some(vec![
            "George Lucas".to_string(),
            "Leigh Brackett".to_string(),
            "Lawrence Kasdan".to_string()
        ]),
    };

    let mut builder = OMDbMovieBuilder::default();

    builder
        .set_imdb_id("tt0080684".to_string())
        .set_title("Star Wars: Episode V - The Empire Strikes Back".to_string())
        .set_rated(Some("PG".to_string()))
        .set_director(Some("George Lucas".to_string()))
        .set_writer(Some(
            "Leigh Brackett, Lawrence Kasdan, George Lucas".to_string(),
        ))
        .set_actors(Some(
            "Mark Hamill, Harrison Ford, Carrie Fisher".to_string(),
        ))
        .set_genre(Some("Action, Adventure, Fantasy".to_string()))
        .set_ratings(Some(vec![
            OMDbRatingBuilder::default()
                .set_source("Internet Movie Database".to_string())
                .set_value("8.7/10".to_string())
                .build(),
            OMDbRatingBuilder::default()
                .set_source("Rotten Tomatoes".to_string())
                .set_value("94%".to_string())
                .build(),
            OMDbRatingBuilder::default()
                .set_source("Metacritic".to_string())
                .set_value("82/100".to_string())
                .build(),
        ]))
        .set_production(Some("N/A".to_string()))
        .set_response("True".to_string());
    
    let omdb_movie = builder.build();

    match test_search_movie_input.match_filters(&omdb_movie) {
        Ok(bool) => assert!(bool),
        Err(err) => panic!("Error parsing fields: {:#?}", err),
    }
}

#[test]
fn check_for_null_works() {
    let test_field = &Some("Test".to_string());

    if let Some(field) = Movie::check_string_for_null(test_field) {
        assert_eq!("Test", field);
    } else {
        panic!("Returned None for {:#?}", test_field);
    }

    let test_null_field = &Some("N/A".to_string());
    let should_be_none = Movie::check_string_for_null(test_null_field);
    assert_eq!(None, should_be_none);

    let should_also_be_none = Movie::check_string_for_null(&None);
    assert_eq!(None, should_also_be_none);
}

#[test]
fn from_works() {
    let mut builder = OMDbMovieBuilder::default();

    builder
        .set_imdb_id("tt0080684".to_string())
        .set_title("Star Wars: Episode V - The Empire Strikes Back".to_string())
        .set_writer(Some(
            "Leigh Brackett, Lawrence Kasdan, George Lucas".to_string(),
        ))
        .set_actors(Some(
            "Mark Hamill, Harrison Ford, Carrie Fisher".to_string(),
        ))
        .set_genre(Some("Action, Adventure, Fantasy".to_string()))
        .set_ratings(Some(vec![
            OMDbRatingBuilder::default()
                .set_source("Internet Movie Database".to_string())
                .set_value("8.7/10".to_string())
                .build(),
            OMDbRatingBuilder::default()
                .set_source("Rotten Tomatoes".to_string())
                .set_value("94%".to_string())
                .build(),
            OMDbRatingBuilder::default()
                .set_source("Metacritic".to_string())
                .set_value("82/100".to_string())
                .build(),
        ]))
        .set_production(Some("N/A".to_string()))
        .set_response("True".to_string());

    let test_omdb_movie = builder.build();

    let test_movie = Movie::from(test_omdb_movie);

    assert!(test_movie.get_released().unwrap() > 0);
    assert_eq!(3, test_movie.get_writers().unwrap());
    assert_eq!(3, test_movie.get_actors().unwrap());
    assert_eq!(3, test_movie.get_genres().unwrap());
    assert_eq!(3, test_movie.get_ratings().unwrap());
    assert_eq!(None, test_movie.get_production());
}
