use async_graphql::{Context, ErrorExtensions, Guard};
use getset::Getters;
use jsonwebtoken::{decode, errors::ErrorKind, Algorithm, DecodingKey, Validation};
use serde::{Deserialize, Serialize};

use crate::Env;

#[derive(Debug, Getters)]
pub struct Auth {
    #[getset(get = "pub")]
    token: String,
}
impl Auth {
    pub fn new(token: Option<String>) -> Self {
        Auth {
            token: token.unwrap_or("".to_string()),
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    sub: String,
    iat: usize,
    exp: usize,
}

pub struct JwtGuard {}
impl JwtGuard {
    /// Format error message based on error kind
    fn fmt_err(&self, err: &ErrorKind) -> async_graphql::Error {
        match err {
            ErrorKind::ExpiredSignature => self.extend_err("Authentication Expired".into()),
            _ => self.extend_err("Invalid Authentication".into()),
        }
    }
    /// Extend error with code
    fn extend_err(&self, err: async_graphql::Error) -> async_graphql::Error {
        err.extend_with(|_, e| e.set("code", "UNAUTHENTICATED"))
    }
}

#[async_trait::async_trait]
impl Guard for JwtGuard {
    /// Check if token is valid, and return error if not
    async fn check(&self, ctx: &Context<'_>) -> Result<(), async_graphql::Error> {
        let token = ctx.data::<Auth>()?.token();
        let secret_key = ctx.data::<Env>()?.secret_key();
        let validation = Validation::new(Algorithm::RS256);

        match decode::<Claims>(
            &token,
            &DecodingKey::from_rsa_pem(secret_key.as_ref())?,
            &validation,
        ) {
            Ok(_data) => Ok(()),
            Err(err) => Err(self.fmt_err(err.kind())),
        }
    }
}
