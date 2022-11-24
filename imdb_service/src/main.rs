use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use async_graphql::{EmptyMutation, EmptySubscription, Object, Schema, SimpleObject, ID};
use async_graphql_actix_web::{GraphQLRequest, GraphQLResponse};
use dotenvy::dotenv;
use reqwest;
use std::{collections::HashMap, env, error::Error};
struct Query;

fn main() {}
