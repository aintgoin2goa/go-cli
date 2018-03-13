const R = require('ramda');

const downloadFromS3AndWrite = require('./downloadFromS3AndWrite');
const {
    getS3GetObjectParamsForChocoJsonFile,
    getS3GetObjectParamsForExtendCssJsonFile,
} = require('../utils/model/lambdaDataS3Params');
const {
    localChocoFilePathAccessor,
    localExtendCssFilePathAccessor,
} = require('../utils/model/lambdaDataAccessors');

const jsonDownloader = (
    localFilePathAccessor,
    s3GetObjectParamsForJsonFileGetter,
    downloaderAndWriter,
    lambdaDataObject
) =>  {
    const getLocalFilePath = R.view(localFilePathAccessor);

    const s3GetObjectParamsForJsonFile = s3GetObjectParamsForJsonFileGetter(
        lambdaDataObject
    );

    const downloaderAndWriterWithFilePath = downloaderAndWriter(
        s3GetObjectParamsForJsonFile
    );

    const downloadJsonFile = R.pipeP(
        argument => Promise.resolve(argument),
        getLocalFilePath,
        downloaderAndWriterWithFilePath
    );

    return downloadJsonFile(lambdaDataObject);
};


const downloadChocoJsonFile = R.curry(jsonDownloader)(
    localChocoFilePathAccessor,
    getS3GetObjectParamsForChocoJsonFile,
    downloadFromS3AndWrite
);

const downloadExtendCssJsonFile = R.curry(jsonDownloader)(
    localExtendCssFilePathAccessor,
    getS3GetObjectParamsForExtendCssJsonFile,
    downloadFromS3AndWrite
);

module.exports = {
    downloadChocoJsonFile,
    downloadExtendCssJsonFile,
    jsonDownloader,
};
