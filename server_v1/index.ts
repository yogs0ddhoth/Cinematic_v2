import { ApolloServer } from 'apollo-server-express';
import app from './app';
import { context } from './context';
import { schema } from './schema';

async function runServer() {
  const PORT = 3001;
  const server = new ApolloServer({
    schema,
    context,
  });

  await server.start();
  server.applyMiddleware({ app });

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
}
runServer();
