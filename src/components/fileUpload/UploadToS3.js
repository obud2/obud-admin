import imageCompression from 'browser-image-compression';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

import { BASE_IMG_URL, S3_BUCKET } from '../../constants';

const REGION = 'ap-northeast-2';
import awsmobile from '../../../aws-exports';

const myBucket = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: awsmobile.aws_accessKeyId,
    secretAccessKey: awsmobile.aws_secretAccessKey,
  },
  signatureVersion: 'v4',
});

export const GetObjectUrl = (key, folder) => {
  return BASE_IMG_URL + key;
};

const UploadToS3 = (file, folder, id, callback, keyName) => {
  return new Promise(async (resolve, reject) => {
    const orgFileName = file.name;
    const ext = file?.name?.substr(file.name.lastIndexOf('.') + 1);
    let _key = keyName ? folder + '/' + id + '_' + keyName + '.' + ext : folder + '/' + id + '_' + file.name;
    let params = {
      ACL: 'public-read',
      Body: file,
      Bucket: S3_BUCKET,
      Key: _key,
    };

    const fileSize = Math.round(file.size / 1024 / 1024);

    if (fileSize > 1000) {
      uploadToLarge(file, _key, S3_BUCKET, callback).then((large) => {
        resolve({
          key: _key,
          name: orgFileName,
          path: large.Location,
        });
      });
    } else {
      const command = new PutObjectCommand(params);

      try {
        await myBucket.send(command);

        resolve({
          key: _key,
          name: orgFileName,
          path: `https://s3.${REGION}.amazonaws.com/${S3_BUCKET}/${_key}`,
        });
      } catch (error) {
        console.log(error);
        alert(error);
        reject(error);
      }
    }
  });
};

let succeededParts = [];
const uploadToLarge = (file, key, bucket, callback) => {
  return new Promise(async (resolve) => {
    console.info(`file size: ${Math.round(file.size / 1024 / 1024)}MB`);
    const chunkSize = Math.pow(1024, 2) * 10; // chunk size is set to 10MB
    const iterations = Math.ceil(file.size / chunkSize); // number of chunks to be broken
    const arr = Array.from(Array(iterations).keys()); // dummy array to loop through
    let uploadId = ''; // we will use this later
    succeededParts = [];
    try {
      await startUpload(key, bucket).then(async (result) => {
        arr.map(async (item) => {
          const blob = file.slice(item * chunkSize, (item + 1) * chunkSize);
          console.log(blob);
          await uploadPart(key, bucket, blob, result.UploadId, item + 1);

          if (callback) callback(Math.round((succeededParts.length / arr.length) * 100));

          if (succeededParts.length === arr.length) {
            console.log('UploadPart Fisnish', succeededParts.length);
            const data = await completeUpload(
              key,
              bucket,
              result.UploadId,
              succeededParts.sort((a, b) => a.PartNumber - b.PartNumber), // needs sorted array
            )
              .catch((completeErr) => {
                abortUpload(key, bucket, result.UploadId);
              })
              .then((complete) => {
                resolve(complete);
              });
          }
        });
      });
    } catch (err) {
      console.error(err);
    }
  });
};
const startUpload = (key, bucket) => {
  const params = {
    Key: key,
    Bucket: bucket,
  };
  return new Promise((resolve, reject) => {
    myBucket.createMultipartUpload(params, (err, data) => {
      if (err) {
        console.log(err);
        return reject(err);
      } else {
        return resolve(data);
      }
    });
  });
};

const uploadPart = (key, bucket, buffer, uploadId, partNumber) => {
  const params = {
    Key: key,
    Bucket: bucket,
    Body: buffer,
    PartNumber: partNumber, // Any number from one to 10.000
    UploadId: uploadId, // UploadId returned from the first method
  };
  // console.log(params);

  return new Promise((resolve, reject) => {
    myBucket.uploadPart(params, (err, data) => {
      if (err) {
        console.error(err.message);
        return reject({ PartNumber: partNumber, error: err });
      } else {
        // console.log(partNumber, data);
        succeededParts.push({ PartNumber: partNumber, ETag: data.ETag });
        return resolve({ PartNumber: partNumber, ETag: data.ETag });
      }
    });
  });
};

const abortUpload = async (key, bucket, uploadId) => {
  const params = {
    Key: key,
    Bucket: bucket,
    UploadId: uploadId,
  };
  return new Promise((resolve, reject) => {
    myBucket.abortMultipartUpload(params, (err, data) => {
      if (err) return reject(err);
      return resolve(data);
    });
  });
};

const completeUpload = async (key, bucket, uploadId, parts) => {
  console.log('CompleteUpload >>>>>');
  const params = {
    Key: key,
    Bucket: bucket,
    UploadId: uploadId,
    MultipartUpload: {
      Parts: parts,
    },
  };
  return new Promise((resolve, reject) => {
    myBucket.completeMultipartUpload(params, (err, data) => {
      if (err) {
        console.log(err.message);
        return reject(err);
      } else {
        // console.log(data);
        return resolve(data);
      }
    });
  });
};

// 이미지 압축
export const imageOptimization = async (file) => {
  const options = {
    maxSizeMB: 1,
  };

  const compressedFile = await imageCompression(file, options);

  return compressedFile;
};

export default UploadToS3;
