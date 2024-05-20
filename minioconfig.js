import { Client } from 'minio';
import path from 'path';
import fs from 'fs';

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

export async function downloadFileFromMinio(bucketName, filename, outputPath) {
    try {
        const result = new Promise(async (resolve, reject) => {
            let data = []
            const DataStream = await minioClient.getObject(bucketName, filename)
            DataStream.on('data', (chunk) => {
                data.push(chunk)
            })
            DataStream.on('end', () => {
                console.log('End');
                const dataresult = new Buffer.concat(data).toString('utf-8')
                const bufferData = new Buffer.concat(data)
                const dir = path.dirname(outputPath);
                fs.mkdir(dir, { recursive: true }, (err) => {
                    if (err) {
                        console.log('Error creating directory', err);
                        reject(err);
                    } else {                       
                        fs.writeFile(outputPath, bufferData, (err) => {
                            if (err) {
                                console.log('Error writing file', err);
                                reject(err);
                            } else {
                                console.log('File written successfully');
                                console.log(outputPath);
                            }
                        });
                    }})
                resolve(dataresult)
            })
            DataStream.on('error', (err) => {
                console.log(err);
                reject(err)
            })
        })
        return await result
    } catch (error) {
        console.log(error);
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

export async function removeObject(bucketName, fileName) {
    try {
        await minioClient.removeObject(bucketName, fileName)
        return true
    } catch (error) {
        console.log(error);
        return false
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

export async function listObject(bucketName) {
    try {
        const result = new Promise((resolve, reject) => {
            const data = []
            const stream = minioClient.listObjects(bucketName, '', true)
            stream.on('data', function (obj) {
                data.push(obj)
            })
            stream.on('end', function () {
                console.log(data)
                resolve(data.map(filedata => {
                    return { name: filedata.name, size: filedata.size, lastModified: new Date(filedata.lastModified).toISOString().slice(0, 19).replace('T', ' ') }
                }))
            })
            stream.on('error', function (err) {
                console.log(err)
                reject(err)
            })
        })
        return await result
    } catch (error) {
        console.log(error);
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

export async function removeIncompleteUpload(bucketName, fileName) {
    try {
        await minioClient.removeIncompleteUpload(bucketName, fileName)
        return true
    } catch (error) {
        console.log(error);
        return false
    }
}
// export async function percentUploaded(bucketName) {
//     try {
//         const Stream = minioClient.listIncompleteUploads(bucketName, '', true)
//         Stream.on('data', function (obj) {
//             console.log(obj)
//             console.log(obj.size)
//         })
//         Stream.on('end', function () {
//             console.log('End')
//             Stream.destroy()
//         })
//         Stream.on('error', function (err) {
//             console.log(err)
//             Stream.destroy()
//         })
//     } catch (error) {
//         console.log(error);
//     }
// }