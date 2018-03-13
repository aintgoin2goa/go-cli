const R = require('ramda');
const AWS = require('aws-sdk');

const getS3Connection = () => {
    const s3 = new AWS.S3();
    return s3;
};

const getS3ConnectionOnce = R.once(getS3Connection);

module.exports = getS3ConnectionOnce;
module.exports.getS3Connection = getS3Connection;
