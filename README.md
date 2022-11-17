# Cinematic_v2

## State of Progress
* implementing microservice architecture with Nest.js
    * the graphql api will be extended to all microservices using Apollo Federation
        - TODOS:
            * Create Subgraph-Services:
                - Auth - &check;SQLite, &check;Prisma ORM, &check;bcrypt, JWT user auth
                - ImDB - fetch ImDB API <- refactor imdb-api
                - MovieDB - MongoDB, Prisma ORM, <- refactor server