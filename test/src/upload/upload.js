const R = require('ramda');

const consoleLogPipeStep = require('../utils/consoleLog/consoleLogPipeStep');
const uploadFileFromS3 = require('../utils/s3/uploadFile');
const compressFolder = require('../utils/filesystem/compressFolder');
const { localAfterBuildFolderPathAccessor } = require('../utils/model/lambdaDataAccessors');
const { getS3PutObjectParamsForBuildOutputFile } = require('../utils/model/lambdaDataS3Params');

const uploader = (
    localAfterBuildFolderPathAccessor,
    folderCompressor,
    s3FileUploader,
    s3PutObjectParamsForBuildOutputFile,
    logStep,
    lambdaDataObject
) => {
    const folderToTarFileCompressorWithFolderPath = R.curry(folderCompressor)('tar');
    const s3UploadCompressedTarFileToS3WithStream = s3FileUploader(
        s3PutObjectParamsForBuildOutputFile(lambdaDataObject)
    );
    const getLocalFolderToCompressWithLambdaObject = R.view(localAfterBuildFolderPathAccessor);

    const getLocalFolderToCompress = input => Promise.resolve(
        getLocalFolderToCompressWithLambdaObject(input)
    );

    const returnLambdaDataObject = () => lambdaDataObject;

    const uploadTar = R.pipeP(
        getLocalFolderToCompress,
        folderToTarFileCompressorWithFolderPath,
        s3UploadCompressedTarFileToS3WithStream,
        returnLambdaDataObject
    );

    const logBegin = input => Promise.resolve(
        logStep.uploadTar(input)
    );

    return R.pipeP(
        logBegin,
        uploadTar
    )(lambdaDataObject);
};


/**
 * Upload
 *
 * This method tars a folder and the uploads it to s3.
 *
 * @params {Object} lambdaDataObject - object specified in src/utils/model
 *
 * @returns {Promise}
 */
const upload = R.curry(uploader)(
    localAfterBuildFolderPathAccessor,
    compressFolder,
    uploadFileFromS3,
    getS3PutObjectParamsForBuildOutputFile,
    consoleLogPipeStep
);

module.exports = upload;
module.exports.uploader = uploader;
