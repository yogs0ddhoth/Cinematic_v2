# Cinematic_v2

## State of Progress
* implementing microservice architecture with Nest.js
    * the graphql api will be extended to all microservices using Apollo Federation
        - TODOS:
            * Create Subgraph-Services:
                - &check; Auth - dir path: ./auth - &check;SQLite, &check;Prisma ORM, &check;bcrypt, &check;JWT user auth
                - &check; ImDB - dir path: ./imdb_service - &check;fetch ImDB API &check;Subgraph Federated
                - &check; MovieDB - dir path: ./server - &check;MongoDB, ~~Prisma ORM,~~ &check;refactor server
                    - ~~implement services for &check;User, &check;Genre, &check;Star~~
                    - &check; integrate JWT Auth for User
                    - &check; Migrate to Mongoose as a more performant longterm solution to [WriteConflicts raised by concurrent MongoDB transactions used by Prisma's ORM](https://github.com/prisma/prisma/issues/12814) (a short term workaround would have been to implement retry middleware)
                    - &check; handle errors caused by possible concurrent write to subdocument - MUCH easier with mongoose

                - Youtube API - fetch trailer by imDb id ** FUTURE DIRECTION