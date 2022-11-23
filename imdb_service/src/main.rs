use async_graphql::{EmptyMutation, EmptySubscription, Object, Schema, SimpleObject, ID};
use async_graphql_actix_web::{GraphQLRequest, GraphQLResponse};
use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use dotenvy::dotenv;
use std::{env, collections::HashMap, error::Error};
use reqwest;
struct Query;

fn main() {}