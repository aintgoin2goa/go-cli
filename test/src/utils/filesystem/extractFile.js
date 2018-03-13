const tar = require('tar-fs');
const R = require('ramda');

const pipeStreams = require('../functional/pipeStreams');

const fileExtractor = (
    tarExtractor,
    streamsPiper,
    extractionType,
    folderPathWhereToExtractFile,
    readStream
) => {
    let extractStream = null;

    switch (extractionType) {
        case 'tar': {
            extractStream = tarExtractor(folderPathWhereToExtractFile);
            break;
        }
        default : {
            // eslint-disable-next-line no-console
            console.error(`No extract mode found for type: ${extractionType}`);
        }
    }

    const readAndExtractStream = streamsPiper(
        readStream,
        extractStream
    );

    return readAndExtractStream;
};

/**
 * Extract file (curried)
 *
 * @param {String} extractionType - currently only 'tar' is supported
 * @param {String} folderPathWhereToExtractFile - where to extract the file
 * @param {Stream} readStream - stream where to extract the file from
 *
 * @returns {Stream} - returns read stream piped with extract stream
 */
const extractFile = R.curry(fileExtractor)(
    tar.extract,
    pipeStreams
);

module.exports = extractFile;
module.exports.fileExtractor = fileExtractor;
