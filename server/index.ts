import { ApolloServer } from "apollo-server-express";
import app from "./app";
import { schema } from "./schema";

async function startServer() {
    const PORT = 3001;
    const server = new ApolloServer({
        schema,
    });

    await server.start();
    server.applyMiddleware({ app });

    app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
        console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
}
startServer();