# Cinematic_v2

## State of Progress
* implementing microservice architecture with Nest.js
    * the graphql api will be extended to all microservices using Apollo Federation
        - TODOS:
            * Create Subgraph-Services:
                - Auth - dir path: ./auth - &check;SQLite, &check;Prisma ORM, &check;bcrypt, &check;JWT user auth
                - ImDB - dir path: ./imdb_service - &check;fetch ImDB API &check;Subgraph Federated
                - MovieDB - dir path: ./server - &check;MongoDB, &check;Prisma ORM, &check;refactor server
                    - TODO: finish implementing services for User, &check;Genre, &check;Star
                    - TODO: integrate JWT Auth for User

                - Youtube API - fetch trailer by imDb id ** FUTURE DIRECTION