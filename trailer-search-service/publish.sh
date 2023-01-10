!# /usr/bin/bash

rover subgraph publish Cinematicv2@current \
  --routing-url http://localhost:4004/graphql \
  --schema ./graph/schema.graphqls \
  --name search-trailer