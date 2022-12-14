# Cinematic_v2
A backend for third-party API calls data processing,persistance, and user auth; incorporating microservice architecture; built for the previous [Cinematic Movie Finder](https://github.com/yogs0ddhoth/Cinematic-Film-Finder) Client refactored for Angular.
A backend for third-party API calls data processing,persistance, and user auth; incorporating microservice architecture; built for the previous [Cinematic Movie Finder](https://github.com/yogs0ddhoth/Cinematic-Film-Finder) Client refactored for Angular.
## State of Progress - TODOS:
* Implementing microservice architecture on the backend
    * **Subgraph-Services**:
        - **Auth** - dir path: ./auth - &check;SQLite, &check;Prisma ORM, &check;bcrypt, &check;JWT user auth
        - **Movie Search** - dir path: ./movie_search_service 
            - ~~&check;fetch ImDB API~~ &check;Subgraph Federated
            - &check; migrate from imdb to OmDB API to accommodate more robust api usage 
            - &check; refactor graph and schemas on MovieDB
            - &check; configure for Federation and publish subgraph
            - TODO: rewrite unit tests
        - **Movie-DB** - dir path: ./server 
            - &check;MongoDB, ~~Prisma ORM,~~ &check;refactor server
            - &check; implement services for &check;User, &check;Genre, &check;Actor, &check;Movie
            - &check; integrate JWT Auth for User
            - &check; Migrate to Mongoose as a more performant longterm solution to [WriteConflicts raised by concurrent MongoDB transactions used by Prisma's ORM](https://github.com/prisma/prisma/issues/12814) (a short term workaround would have been to implement retry middleware)
            - &check; ~~handle errors caused by possible concurrent write to subdocument~~ not an issue with mongoose upsert
            - &check; update &check;models and services according to schema changes
            - &check; configure resolvers
            - write unit tests for AppService
        - **Trailer Search** - 
            - &check; implement microservice to query Youtube API for movie trailers &check; and filter results for relevance
            - &check; respond with selected list of url paths 
            - &check; configure for Federation and publish subgraph
    - &check; Configure supergraph and apollo router
* **Fill out Client**:
    - &check; generate gql types
    - replace legacy jquery rendering with angular/ngx-bootstrap rendering
    - create user authentication (login/logout forms) and profile components
    - create navbar components to link homepage, profile, and auth
* **Configure Docker**:
    - finish docker/compose files
    - create image cluster locally
* **Deployment**:
    - AWS: EC2