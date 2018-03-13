const R = require('ramda');

const downloadFileFromS3 = require('../utils/s3/downloadFile');
const extractFile = require('../utils/filesystem/extractFile');
const convertStreamToPromise = require('../utils/stream/convertStreamToPromise');

const downloaderAndExtractor = (
    s3FileDownloader,
    fileExtractor,
    streamToPromiseConverter,
    s3GetObjectParams,
    localExtractedFolderPath
) => {
    const tarFileExtractorWithStream = R.curry(fileExtractor)(
        'tar',
        localExtractedFolderPath
    );

    const streamToPromiseConverterWithStream = R.curry(streamToPromiseConverter)(
        localExtractedFolderPath,
        null
    );

    const downloadAndExtract = R.pipe(
        s3FileDownloader,
        tarFileExtractorWithStream,
        streamToPromiseConverterWithStream
    );


    return downloadAndExtract(s3GetObjectParams);
};


/**
 * Download and Extract
 *
 * Download from S3 and then extract tar file to
 * specified folder passed as parameter.
 *
 * @params {Object} s3GetObjectParams - object used in s3 getObject method
 *     @params {String} s3GetObjectParams.Key - file path on s3
 *     @params {String} s3GetObjectParams.Bucket - s3 bucket name
 * @params {String} localExtractedFolderPath - where to extract downloaded files
 *
 * @returns {Promise}
 */
const downloadAndExtract = R.curry(downloaderAndExtractor)(
    downloadFileFromS3,
    extractFile,
    convertStreamToPromise
);

module.exports = downloadAndExtract;
module.exports.downloaderAndExtractor = downloaderAndExtractor;
