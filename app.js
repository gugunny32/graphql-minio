import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from './graphql/typeDefs.js';
import { resolvers } from './graphql/resolvers.js';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';
import cors from 'cors';

const schema = makeExecutableSchema({ typeDefs, resolvers })
const PORT = 8000;

const server = new ApolloServer({ schema });
const app = express();
await server.start()
app.use('/graphql', cors(), express.json({ limit: '100mb' }), graphqlUploadExpress(), expressMiddleware(server));

app.listen(PORT, () => {
    console.log(`Server is running at http://host.docker.internal:${PORT}/graphql`);
});