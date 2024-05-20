import { gql } from 'graphql-tag';

export const typeDefs = gql`
  scalar Upload

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
    url: String!
  }

  type FileData {
    name: String!
    size: Float!
    lastModified: String!
  }

  type Bucket {
    name: String!
    creationDate: String!
  }

  type Query {
    listBucket: [Bucket!]!

    listObjectInBucket(
      bucket: String!
    ): [FileData!]
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

    removeObject(
        bucket: String!
        fileName: String!
    ): Boolean!

    removeIncompleteUpload(
        bucket: String!
        fileName: String!
    ): Boolean!
  }
`;