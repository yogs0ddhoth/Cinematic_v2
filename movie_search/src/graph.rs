mod models;
use models::*;
mod omdb_models;
mod resolvers;

use async_graphql::{Context, InputObject, Object, SimpleObject};
use async_trait::async_trait;
use reqwest;
use serde;

use crate::auth::JwtGuard;

// #[cfg(test)]
// mod tests;

/// trait for formatting urls
pub trait FormatUrl {
    fn fmt_omdb_url(&self, key: &String) -> String;
}

/// trait for resolving graphql queries
#[async_trait]
trait Resolvers {
    async fn search_movies(&self, ctx: &Context<'_>) -> Vec<Movie>;
}

#[async_trait]
trait EntityResolvers {
    async fn find_movie_trailers_by_title(title: String) -> MovieTrailers;
}

/// graphql query object
pub struct Query;
#[Object]
impl Query {
    /// resolver for searchMovies
    #[graphql(guard = "JwtGuard {}")]
    async fn search_movies<'ctx>(
        &self,
        ctx: &Context<'ctx>,
        search_movie_input: SearchMovieInput,
    ) -> Vec<Movie> {
        search_movie_input.search_movies(ctx).await
    }

    /// entity recolver for MovieTrailers
    #[graphql(entity)]
    async fn find_movie_trailers_by_title<'a>(
        &self,
        #[graphql(key)] title: String,
    ) -> MovieTrailers {
        MovieTrailers::find_movie_trailers_by_title(title).await
    }
}
