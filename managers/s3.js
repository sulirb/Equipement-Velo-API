require("dotenv").config();
const S3 = require("aws-sdk/clients/s3");
const fs = require("fs");

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESSS_KEY;
const secretAccessKey = process.env.AWS_SECRETE_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

// uploads a file to s3 images folder

function uploadFileImages(file) {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: `titre-images/${file.filename}`,
    ContentType: file.mimetype,
    ACL: "public-read",
  };
  return s3.upload(uploadParams).promise();
}

exports.uploadFileImages = uploadFileImages;

// uploads a file to s3 content folder

function uploadFileContent(fileBuffer, fileName, mimeType) {
  const uploadParams = {
    Bucket: bucketName,
    Body: fileBuffer,
    Key: `content/${fileName}`,
    ContentType: mimeType,
    ACL: "public-read",
  };
  return s3.upload(uploadParams).promise();
}

exports.uploadFileContent = uploadFileContent;

// downloads a file from s3

function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName,
  };

  return s3.getObject(downloadParams).createReadStream();
}

exports.getFileStream = getFileStream;
