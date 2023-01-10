!# /usr/bin/bash

rover subgraph publish Cinematicv2@current \
  --routing-url http://localhost:4003/graphql \
  --schema schema.graphql \
  --name search-movie