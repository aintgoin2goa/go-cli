const R = require('ramda');

const downloadFileFromS3 = require('../utils/s3/downloadFile');
const writeFile = require('../utils/filesystem/writeFileWithStream');
const convertStreamToPromise = require('../utils/stream/convertStreamToPromise');

const downloaderAndWriterToFs = (
    s3FileDownloader,
    fileWriterWithStream,
    streamToPromiseConverter,
    s3GetObjectParams,
    localFilePath
) => {
    const aliasesFileWriterWithStream = R.curry(fileWriterWithStream)(
        localFilePath
    );

    const streamToPromiseConverterWithStream = R.curry(streamToPromiseConverter)(
        localFilePath,
        null
    );

    const downloadAndExtract = R.pipe(
        s3FileDownloader,
        aliasesFileWriterWithStream,
        streamToPromiseConverterWithStream
    );
    return downloadAndExtract(s3GetObjectParams);
};

/**
 * Download and Write to Filesystem
 *
 * Download from S3 and write to filesystem.
 *
 * @params {Object} s3GetObjectParams - object used in s3 getObject method
 *     @params {String} s3GetObjectParams.Key - file path on s3
 *     @params {String} s3GetObjectParams.Bucket - s3 bucket name
 * @params {String} localFilePath - where to write downloaded file
 *
 * @returns {Promise}
 */
const downloadAndWriteToFs = R.curry(downloaderAndWriterToFs)(
    downloadFileFromS3,
    writeFile,
    convertStreamToPromise
);

module.exports = downloadAndWriteToFs;
module.exports.downloaderAndWriter = downloaderAndWriterToFs;
