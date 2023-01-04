use super::*;
use crate::resolvers::{
    graph::{Actor, Genre, Movie, MovieTrailers, Rating, RatingInput, SearchMovieInput},
    models::{OMDbMovie, OMDbSearchData, OMDbRating, OMDbSearchResult},
};
use dotenvy::dotenv;
use tokio;

#[test]
fn fmt_omdb_url_works() {
    let test_search_movie_input = SearchMovieInput {
        title: String::from("Star%20Wars"),
        release_year: String::new(),
        ratings: None,
        pages: 1,
        content_rating: None,
        genres: None,
    };
    let test_omdb_search_result = OMDbSearchResult {
        imdb_id: String::from("tt0076759"),
    };
    let test_omdb_search_url = test_omdb_search_result.fmt_omdb_url();
    let test_search_movie_url = test_search_movie_input.fmt_omdb_url();
    // println!("{test_omdb_search_url}");
    // println!("{test_search_movie_url}");

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
        genres: None,
    };
    let test_search_movie_url = test_search_movie_input.fmt_omdb_url();

    let test_omdb_search_result = OMDbSearchResult {
        imdb_id: String::from("tt0076759"),
    };
    let test_omdb_search_url = test_omdb_search_result.fmt_omdb_url();

    let client = reqwest::Client::new();

    let (omdb_results_1, omdb_results_2) = tokio::join!(
        client.send_get_request::<OMDbSearchData>(&test_search_movie_url),
        client.send_get_request::<OMDbMovie>(&test_omdb_search_url),
    );

    match (omdb_results_1, omdb_results_2) {
        (Ok(result_1), Ok(result_2)) => {
            assert!(result_1.search.is_some());
            assert!(result_2.imdb_id == "tt0076759");
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
        genres: Some(vec![
            String::from("Action"),
            String::from("Adventure"),
            String::from("Fantasy"),
        ]),
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
                    Ok(data) => match &data.search {
                        Some(result_page) => {
                            for result in result_page {
                                id_urls.push(result.fmt_omdb_url())
                            }
                        }
                        None => match &data.error {
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
                source: String::from("Metacritic"),
                score: 80.0,
            },
            RatingInput {
                source: String::from("Internet Movie Database"),
                score: 8.0,
            },
            RatingInput {
                source: String::from("Rotten Tomatoes"),
                score: 80.0,
            },
        ]),
        pages: 1,
        content_rating: Some(vec![String::from("PG"), String::from("PG-13")]),
        genres: Some(vec![
            String::from("Action"),
            String::from("Adventure"),
            String::from("Fantasy"),
        ]),
    };
    let test_omdb_search_result = OMDbSearchResult {
        imdb_id: String::from("tt0080684"),
    };
    let client = reqwest::Client::new();
    let omdb_movie = client
        .send_get_request::<OMDbMovie>(&test_omdb_search_result.fmt_omdb_url())
        .await
        .unwrap();
    println!("{:#?}", omdb_movie);
    match test_search_movie_input.match_filters(&omdb_movie) {
        Ok(bool) => assert!(bool),
        Err(err) => panic!("Error parsing fields: {:#?}", err),
    }
}

#[test]
fn check_for_null_works() {
    let test_movie = Movie {
        title: "Test".to_string(),
        imdb_id: Some("Test".to_string()),
        year: None,
        released: None,
        content_rating: None,
        runtime: None,
        director: None,
        writers: None,
        actors: None,
        plot: None,
        genres: None,
        language: None,
        country: None,
        awards: None,
        image: None,
        trailers: MovieTrailers { title: "Test".to_string() },
        ratings: None,
        imdb_votes: None,
        box_office: None,
        production: None,
    };
    if let Some(field) = Movie::check_for_null(test_movie.imdb_id) {
        assert_eq!("Test", field);
    } else {
        panic!("Movie::check_for_null returned None");
    }
}

#[test]
fn from_works() {
    let test_omdb_movie = OMDbMovie {
        imdb_id: "tt0080684".to_string(),
        title: "Star Wars: Episode V - The Empire Strikes Back".to_string(),
        year: None,
        released: None,
        rated: None,
        runtime: None,
        director: None,
        writer: Some("Leigh Brackett, Lawrence Kasdan, George Lucas".to_string()),
        actors: Some("Mark Hamill, Harrison Ford, Carrie Fisher".to_string()),
        plot: None,
        genre: Some("Action, Adventure, Fantasy".to_string()),
        language: None,
        country: None,
        awards: None,
        poster: None,
        ratings: Some(vec![
            OMDbRating {
                source: "Internet Movie Database".to_string(),
                value: "8.7/10".to_string(),
            },
            OMDbRating {
                source: "Rotten Tomatoes".to_string(),
                value: "94%".to_string(),
            },
            OMDbRating {
                source: "Metacritic".to_string(),
                value: "82/100".to_string(),
            }
        ]),
        metascore: None,
        imdb_rating: None,
        imdb_votes: None,
        box_office: None,
        production: None,
        response: "True".to_string(),
    };
}