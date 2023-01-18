use crate::{graph::FormatUrl, Env, Request};

use super::{
    // external crates:
    async_trait,
    // local modules:
    models::*,
    omdb_models::*,
    reqwest,
    Context,
    EntityResolvers,
    Resolvers,
};

#[async_trait]
impl Resolvers for SearchMovieInput {
    async fn search_movies(&self, ctx: &Context<'_>) -> Vec<Movie> {
        let client = ctx.data::<reqwest::Client>().unwrap();
        let key = ctx.data::<Env>().unwrap().omdb_key();

        let mut id_urls = Vec::new();
        {
            // Search OMDB for all movies that match search_movie_input, and push the information to id_urls
            let search_urls = self.fmt_paginated_urls(key);
            // concurrently send requests for each of the urls
            client
                .send_many_get_requests::<OMDbSearchData>(search_urls)
                .await
                .iter()
                .for_each(|results| {
                    // Filter out error responses, convert search_results to omdb_url Strings, and push to id_urls
                    println!("Filtering results...");
                    match results {
                        Ok(data) => match data.search() {
                            Some(result_page) => {
                                for result in result_page {
                                    id_urls.push(result.fmt_omdb_url(key))
                                }
                            }
                            None => match data.error() {
                                Some(err) => println!("Found an Error: {}", err),
                                None => (),
                            },
                        },
                        Err(err) => println!("Found an Error: {:#?}", err),
                    }
                });
        }

        let mut movies = Vec::new();
        {
            // concurrently send requests for each of the id url
            client
                .send_many_get_requests::<OMDbMovie>(id_urls)
                .await
                .into_iter()
                .for_each(|result| {
                    println!("Filtering results...");
                    match result {
                        // Handle Error responses and apply search filters
                        Ok(movie) => match self.match_filters(&movie) {
                            Ok(bool) => {
                                if bool {
                                    movies.push(movie)
                                }
                            }
                            Err(err) => {
                                println!("Error parsing fields: {:#?}", err);
                            }
                        },
                        Err(err) => println!("Found an Error: {:#?}", err),
                    }
                });
        }
        println!("Done! Sending response...");
        movies.into_iter().map(|movie| Movie::from(movie)).collect()
    }
}

#[async_trait]
impl EntityResolvers for MovieTrailers {
    async fn find_movie_trailers_by_title(title: String) -> MovieTrailers {
        MovieTrailers::new(title)
    }
}
