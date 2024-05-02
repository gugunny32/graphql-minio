import { Client } from 'minio';

const minioClient = new Client({
    endPoint: 'minio',
    port: 9000,
    useSSL: false,
    accessKey: 'admin',
    secretKey: 'admin1234'
});
  
export async function uploadFileToMinIO(stream, filename, bucketName) {
    try {
        await minioClient.putObject(bucketName, filename, stream);
        return `http://localhost:${minioClient.port}/${bucketName}/${filename}`;
    } catch (error) {
        throw new Error(error)
    }
}

export async function createBucketForMinIO(bucketName) {
    try {
        await minioClient.makeBucket(bucketName)
        return `http://localhost:${minioClient.port}/${bucketName}`
    } catch (error) {
        throw new Error(error)
    }
}

export async function listAllBucket() {
    try {
        const buckets = await minioClient.listBuckets()
        console.log(buckets);
        return buckets.map(bucket => {
            return { name: bucket.name, creationDate: new Date(bucket.creationDate).toISOString().slice(0, 19).replace('T', ' ') }
        })
    } catch (error) {
        throw new Error(error)
    }
}

export async function removeBucket(bucketName) {
    try {
        await minioClient.removeBucket(bucketName)
        const isExists = await minioClient.bucketExists(bucketName)
        return !isExists
    } catch (error) {
        throw new Error(error)
    }
}