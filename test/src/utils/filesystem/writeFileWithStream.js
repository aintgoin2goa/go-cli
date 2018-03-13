const fs = require('fs');

const R = require('ramda');

const pipeStreams = require('../functional/pipeStreams');

const fileWriterWithStream = (
    streamsPiper,
    localFilePath,
    readStream
) => {
    const writeStream = fs.createWriteStream(localFilePath);
    const finalStream = streamsPiper(
        readStream,
        writeStream
    );
    return finalStream;
};

/**
 * Write File
 *
 * this will write an input read stream into a file path passed as varialbe
 *
 * @param {String} localFilePath - file path to write to
 * @param {String} readStream - read stream where to get information from
 *
 * @returns {Stream} read and write file stream
 */
const writeFile = R.curry(fileWriterWithStream)(
    pipeStreams
);

module.exports = writeFile;
module.exports.fileWriterWithStream = fileWriterWithStream;
