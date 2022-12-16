# Cinematic_v2
A Backend for data persistance, incorporating microservice architecture, built for the previous [Cinematic Movie Finder](https://github.com/yogs0ddhoth/Cinematic-Film-Finder) Client refactored for Angular, and added user auth.
## State of Progress - TODOS:
* Implementing microservice architecture on the backend
    * Subgraph-Services:
        - Auth - dir path: ./auth - &check;SQLite, &check;Prisma ORM, &check;bcrypt, &check;JWT user auth
        - ImDB - dir path: ./imdb_service - &check;fetch ImDB API &check;Subgraph Federated
            - incoorporate OmDB API, and ImDB youtube trailer fetch calls - refactor graph and schemas on MovieDB
        - MovieDB - dir path: ./server - &check;MongoDB, ~~Prisma ORM,~~ &check;refactor server
            - implement services for &check;User, &check;Genre, &check;Star
            - &check; integrate JWT Auth for User
            - &check; Migrate to Mongoose as a more performant longterm solution to [WriteConflicts raised by concurrent MongoDB transactions used by Prisma's ORM](https://github.com/prisma/prisma/issues/12814) (a short term workaround would have been to implement retry middleware)
            - &check; handle errors caused by possible concurrent write to subdocument - MUCH easier with mongoose
    - Configure supergraph and apollo router
* Fill out Client:
    - replace legacy jquery rendering with angular/ngx-bootstrap rendering
    - create user authentication (login/logout) and profile components
    - create navbar components to link homepage, profile, and auth
* Configure Docker:
    - finish docker/compose files
    - create image cluster locally
* Deployment:
    - AWS: EC2