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

    listObject(
      bucket: String!
    ): [FileData!]

    listIncompleteUpload(
        bucket: String!
    ): [String!]
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

    renameObject(
        bucket: String!
        fileName: String!
        newFileName: String!
    ): String!

    removeIncompleteUpload(
        bucket: String!
        fileName: String!
    ): Boolean!
  }
`;