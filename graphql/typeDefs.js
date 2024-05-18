import { gql } from 'graphql-tag';

export const typeDefs = gql`
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

    singleDownload(
        bucket: String!
        filename: String!
    ): String!

    createBucket(
        name: String!
    ): String!

    removeBucket(
        name: String!
    ): Boolean!
  }
`;