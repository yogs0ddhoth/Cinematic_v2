# Cinematic_v2

## State of Progress
* implementing microservice architecture with Nest.js
    * the graphql api will be extended to all microservices using Apollo Federation
        - TODOS:
            * Create Subgraph-Services:
                - Auth - path: ./auth - &check;SQLite, &check;Prisma ORM, &check;bcrypt, &check;JWT user auth
                - ImDB - path: ./imdb_service - &check;fetch ImDB API &check;Subgraph Federated
                - MovieDB - path: ./server - &check;MongoDB, Prisma ORM, <- refactor server
                    - TODO: implement services for User, Genre, Star
                    - TODO: integrate JWT Auth for User

                - Youtube API - fetch trailer by imDb id ** FUTURE DIRECTION