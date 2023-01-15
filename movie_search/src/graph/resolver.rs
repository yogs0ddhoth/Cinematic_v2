use crate::{graph::FormatUrl, Env, Request};

use super::{
    // traits:
    // FormatUrl, Resolver,
    // external crates:
    async_trait,
    // std lib
    // ParseFloatError,
    // local modules:
    models::*,
    omdb_models::*,
    reqwest,
    Context,
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
            let mut search_urls = Vec::new();
            for i in 1..self.pages + 1 {
                // for pagination
                // push urls for each page (see omdb api) to search_urls
                search_urls.push(format!(
                    "{url}&page={num}",
                    url = self.fmt_omdb_url(key),
                    num = i
                ));
            }
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
