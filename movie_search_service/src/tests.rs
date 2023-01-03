use super::*;
use crate::client::{OMDbMovie, OMDbSearchData, OMDbSearchResult};
use crate::schema::{Movie, MovieTrailers, SearchMovieInput};
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
async fn many_get_requests_with_filters_work() {
    dotenv().ok();

    let test_search_movie_input = SearchMovieInput {
        title: String::from("Star%20Wars"),
        release_year: String::new(),
        ratings: None,
        pages: 3,
        content_rating: Some(String::from("PG")),
        genres: Some(String::from("Action")),
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
                                println!("Found an Error: {}", err);
                                panic!("Request Errors");
                            }
                            None => panic!("Request Errors: No Result found."),
                        },
                    },
                    Err(err) => {
                        println!("Found an Error: {:#?}", err);
                        panic!("Request Errors");
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
                    // Filter out error responses
                    Ok(movie) => {
                        
                        if test_search_movie_input.match_filters(&movie) {
                            println!("{:#?}", movie);
                            assert_eq!(movie.rated, test_search_movie_input.content_rating);
                            if let Some(genre) = &movie.genre {
                                assert!(genre.contains(&String::from("PG")));
                            } else {
                                panic!("match_filters failed to filter out None values")
                            }
                            
                            movies.push(movie)
                        }
                    }
                    Err(err) => {
                        println!("Found an Error: {:#?}", err);
                        panic!("Request Errors");
                    }
                }
            });
    }
    // assert!(movies.len() > 0);
    println!("{:#?}", movies);
}
