const path = require('path');

const AWS = require('aws-sdk');

const createLambdaDataObject = (
    environmentVariables,
    initData
) => {
    if (initData === null) {
        return null;
    }

    const localTmpFolder = path.resolve(
        environmentVariables.LOCAL_TMP_FOLDER,
        `./${initData.buildNumber}_${initData.flavourId}/`
    );

    const s3BuildOutputFilePath = path.join(
        initData.folderPath,
        environmentVariables.REMOTE_CORE_ENGINE_FILE_NAME
    );

    const s3FileToDownloadFilePath = path.join(
        initData.pipelineFolderPath,
        environmentVariables.REMOTE_FILE_TO_DOWNLOAD_FILE_NAME
    );

    const s3ChocoFilePath = path.join(
        initData.folderPath,
        initData.filename
    );

    const s3ExtendCssFilePath = path.join(
        initData.folderPath,
        environmentVariables.REMOTE_EXTEND_CSS_FILE_NAME
    );

    const localAfterBuildFolderPath = path.resolve(
        localTmpFolder,
        environmentVariables.LOCAL_PROJECT_FOLDER_AFTER_ALL_BUILD_STEPS
    );

    const localExtractedFolderPath = path.resolve(
        localTmpFolder,
        environmentVariables.LOCAL_PROJECT_TO_BUILD_ROOT_FOLDER
    );

    const localToBuildFolderPath = path.resolve(
        localTmpFolder,
        environmentVariables.LOCAL_PROJECT_TO_BUILD_ROOT_FOLDER,
        environmentVariables.LOCAL_PROJECT_TO_BUILD_SOURCE_FOLDER
    );

    const localChocoFilePath = path.resolve(
        localToBuildFolderPath,
        initData.filename
    );

    const localExtendCssFilePath = path.resolve(
        localToBuildFolderPath,
        environmentVariables.REMOTE_EXTEND_CSS_FILE_NAME
    );

    const localToBuildPackageJsonFilePath = path.resolve(
        localToBuildFolderPath,
        './package.json'
    );

    const localToBuildDistFolderPath = path.resolve(
        localToBuildFolderPath,
        'dist'
    );

    const localAfterBuildPackageJsonFilePath = path.resolve(
        localAfterBuildFolderPath,
        'package.json'
    );

    const localAfterBuildDistFolderPath = path.resolve(
        localAfterBuildFolderPath,
        'dist'
    );

    const coreEnginePackageJsonFilePath = path.resolve(
        environmentVariables.LOCAL_ROOT_FOLDER,
        'package.json'
    );

    const build = {
        name: initData.pipelineName,
        flavourId: initData.flavourId,
        number: initData.buildNumber,
        chapter: initData.chapter,
        country: initData.country,
    };

    const s3 = {
        bucket                 : initData.s3Bucket,
        region                 : initData.s3Region,
        triggerFileFolder      : initData.folderPath,
        fileToDownloadFilePath : s3FileToDownloadFilePath,
        buildOutputFilePath    : s3BuildOutputFilePath,
        chocoFilePath          : s3ChocoFilePath,
        extendCssFilePath      : s3ExtendCssFilePath,
    };

    const local = {
        toBuildFolderPath                 : localToBuildFolderPath,
        toBuildPackageJsonFilePath        : localToBuildPackageJsonFilePath,
        toBuildDistFolderPath             : localToBuildDistFolderPath,
        afterBuildFolderPath              : localAfterBuildFolderPath,
        afterBuildPackageJsonFilePath     : localAfterBuildPackageJsonFilePath,
        afterBuildDistFolderPath          : localAfterBuildDistFolderPath,
        extractedFolderPath               : localExtractedFolderPath,
        chocoFilePath                     : localChocoFilePath,
        extendCssFilePath                 : localExtendCssFilePath,
        tmpFolder: localTmpFolder,
        coreEnginePackageJsonFilePath,
    };

    AWS.config.update({ region: s3.s3Region });

    return {
        build,
        local,
        s3,
        processEnv : environmentVariables,
    };
};

module.exports = createLambdaDataObject;
