import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { gql } from 'graphql-tag';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';
import { uploadFileToMinIO, createBucketForMinIO, listAllBucket, removeBucket } from './minioconfig.js';
import cors from 'cors';

const typeDefs = gql`
  scalar Upload

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
    url: String!
  }

  type Bucket {
    name: String!
    creationDate: String!
  }

  type Query {
    listBucket: [Bucket!]!
  }

  type Mutation {
    singleUpload(
        file: Upload!
        bucket: String!
    ): File!

    createBucket(
        name: String!
    ): String!

    removeBucket(
        name: String!
    ): Boolean!
  }
`;

const resolvers = {
    Upload: GraphQLUpload,

    Query: {
        listBucket: async () => {
            const buckets = await listAllBucket()
            return buckets
        },
    },
    Mutation: {
        singleUpload: async (_, args) => {
            const { bucket, file } = args
            const { createReadStream, filename, mimetype, encoding } = await file;
            const stream = createReadStream();
            const url = await uploadFileToMinIO(stream, filename, bucket);
            return { filename, mimetype, encoding, url };
        },

        createBucket: async (_, args) => {
          const { name } = args
          const url = await createBucketForMinIO(name)
          return url
        },

        removeBucket: async (_, args) => {
          const { name } = args
          const isExists = await removeBucket(name)
          return isExists
        }
    },
};
const schema = makeExecutableSchema({ typeDefs, resolvers })
const PORT = 8000;

const server = new ApolloServer({ schema });
const app = express();
await server.start()
app.use('/graphql', cors(), express.json({ limit: '100mb' }), graphqlUploadExpress(), expressMiddleware(server));

app.listen(PORT, () => {
    console.log(`Server is running at http://host.docker.internal:${PORT}${server.graphqlPath}`);
});