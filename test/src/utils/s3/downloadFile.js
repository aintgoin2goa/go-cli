const R = require('ramda');

const getS3Connection = require('./getS3Connection');

const s3FileDownloader = (
    s3ConnectionGetter,
    s3GetObjectParameters
) => {
    const s3 = s3ConnectionGetter();

    return s3.getObject(s3GetObjectParameters)
        .createReadStream();
};

/**
 * Download from S3
 *
 * @param {Object} s3GetObjectParameters
 *   @param {string} s3GetObjectParameters.Bucket - S3 bucket name
 *   @param {string} s3GetObjectParameters.Key - S3 file path you want download
 *
 * @returns {Stream} - Stream of the downloading file
 */
const downloadFileFromS3 = R.curry(s3FileDownloader)(
    getS3Connection
);

module.exports = downloadFileFromS3;
module.exports.s3FileDownloader = s3FileDownloader;
