import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import { uploadFileToMinIO, createBucketForMinIO, listAllBucket, removeBucket, percentUploaded, downloadFileFromMinio } from '../minioconfig.js';

export const resolvers = {
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
            // percentUploaded(bucket);
            return { filename, mimetype, encoding, url };
        },

        singleDownload: async (_, args) => {
            const { bucket, filename } = args
            const result = await downloadFileFromMinio(bucket, filename, `/download/${filename}`)
            return result
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
        },
    },
};