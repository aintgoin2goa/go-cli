const R = require('ramda');

const downloadFromS3AndExtract = require('./downloadFromS3AndExtract');
const { localExtractedFolderPathAccessor } = require('../utils/model/lambdaDataAccessors');
const { getS3GetObjectParamsForABSOutputFile } = require('../utils/model/lambdaDataS3Params');

const absTarFileDownloader = (
    localExtractedFolderPathAccessor,
    s3GetObjectParamsForABSOutputFileGetter,
    downloaderAndExtractor,
    lambdaDataObject
) => {
    const getLocalExtractedFolderPath = R.view(localExtractedFolderPathAccessor);

    const s3GetObjectParamsForAbsOutputFile = s3GetObjectParamsForABSOutputFileGetter(
        lambdaDataObject
    );

    const targetAbsOutputFileDownloaderAndExtractorWithFolderPath = R.curry(downloaderAndExtractor)(
        s3GetObjectParamsForAbsOutputFile
    );

    const downloadAbsTarFile = R.pipeP(
        argument => Promise.resolve(argument),
        getLocalExtractedFolderPath,
        targetAbsOutputFileDownloaderAndExtractorWithFolderPath
    );

    return downloadAbsTarFile(lambdaDataObject);
};

const downloadAbsTarFile = R.curry(absTarFileDownloader)(
    localExtractedFolderPathAccessor,
    getS3GetObjectParamsForABSOutputFile,
    downloadFromS3AndExtract
);


module.exports = downloadAbsTarFile;
module.exports.absTarFileDownloader = absTarFileDownloader;
