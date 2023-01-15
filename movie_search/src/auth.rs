use async_graphql::{Context, Guard};
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
#[async_trait::async_trait]
impl Guard for JwtGuard {
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
            Err(err) => match err.kind() {
                ErrorKind::ExpiredSignature => Err("Authentication expired".into()),
                _ => Err("Invalid Authentication".into()),
            },
        }
    }
}
