const tar = require('tar-fs');
const R = require('ramda');

const folderCompressor = (
    tarCompressor,
    compressionType,
    folderToCompress
) => {
    let compressStream = null;

    switch (compressionType) {
        case 'tar': {
            compressStream = tarCompressor(folderToCompress);
            break;
        }
        default : {
            // eslint-disable-next-line no-console
            console.error(`No extract mode found for type: ${compressionType}`);
        }
    }

    return compressStream;
};

/**
 * Compress folder (curried)
 *
 * @param {String} compressionType - currently only 'tar' is supported
 * @param {String} folderToCompress - which folder we have to compress
 *
 * @returns {Stream} - returns stream of folder compression
 */
const compressFolder = R.curry(folderCompressor)(
    tar.pack
);

module.exports = compressFolder;
module.exports.folderCompressor = folderCompressor;
