const R = require('ramda');

const getS3Connection = require('./getS3Connection');

const s3FileUploader = (
    s3ConnectionGetter,
    s3UploadParams,
    stream
) => {
    const params = Object.assign(
        {},
        s3UploadParams,
        {
            Body: stream,
        }
    );

    const s3 = s3ConnectionGetter();
    return s3.upload(params).promise();
};

/**
 * Upload to S3 (curried)
 *
 * @param {Object} s3UploadParams
 *   @param {string} s3UploadParams.Bucket - S3 bucket name
 *   @param {string} s3UploadParams.Key - S3 file path you want to upload to
 * @param {Stream} stream - readable stream to get the file to upload
 *
 *
 * @returns {Promise} - Promise is fullfilled when the upload is done
 */
const uploadFileToS3 = R.curry(s3FileUploader)(
    getS3Connection
);

module.exports = uploadFileToS3;
module.exports.s3FileUploader = s3FileUploader;
