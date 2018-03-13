const R = require('ramda');

const buildAccessor = R.lensProp('build');
const s3Accessor = R.lensProp('s3');
const localAccessor = R.lensProp('local');

const pipelineNameAccessor = R.compose(
    buildAccessor,
    R.lensProp('name')
);

const buildNumberAccessor = R.compose(
    buildAccessor,
    R.lensProp('number')
);

const flavourIdAccessor = R.compose(
    buildAccessor,
    R.lensProp('flavourId')
);

const s3BucketAccessor = R.compose(
    s3Accessor,
    R.lensProp('bucket')
);

const s3FolderAccessor = R.compose(
    s3Accessor,
    R.lensProp('triggerFileFolder')
);

const s3FileToDownloadFilePathAccessor = R.compose(
    s3Accessor,
    R.lensProp('fileToDownloadFilePath')
);

const s3BuildOutputFilePathAccessor = R.compose(
    s3Accessor,
    R.lensProp('buildOutputFilePath')
);

const localExtractedFolderPathAccessor = R.compose(
    localAccessor,
    R.lensProp('extractedFolderPath')
);

const s3ChocoFilePathAccessor = R.compose(
    s3Accessor,
    R.lensProp('chocoFilePath')
);

const localChocoFilePathAccessor = R.compose(
    localAccessor,
    R.lensProp('chocoFilePath')
);

const s3ExtendCssFilePathAccessor = R.compose(
    s3Accessor,
    R.lensProp('extendCssFilePath')
);

const localExtendCssFilePathAccessor = R.compose(
    localAccessor,
    R.lensProp('extendCssFilePath')
);

const localToBuildPackageJsonFilePathAccessor = R.compose(
    localAccessor,
    R.lensProp('toBuildPackageJsonFilePath')
);

const localToBuildDistFolderPathAccessor = R.compose(
    localAccessor,
    R.lensProp('toBuildDistFolderPath')
);

const localToBuildFolderPathAccessor = R.compose(
    localAccessor,
    R.lensProp('toBuildFolderPath')
);

const localAfterBuildFolderPathAccessor = R.compose(
    localAccessor,
    R.lensProp('afterBuildFolderPath')
);

const localAfterBuildPackageJsonFilePathAccessor = R.compose(
    localAccessor,
    R.lensProp('afterBuildPackageJsonFilePath')
);

const localAfterBuildDistFolderPathAccessor = R.compose(
    localAccessor,
    R.lensProp('afterBuildDistFolderPath')
);

const coreEnginePackageJsonFilePathPathAccessor = R.compose(
    localAccessor,
    R.lensProp('coreEnginePackageJsonFilePath')
);

const getBuildParams = lambdaDataObject => {
    if (lambdaDataObject === null) {
        return 'error_while_parsing_event';
    }
    const pipelineName = R.view(
        pipelineNameAccessor,
        lambdaDataObject
    );
    const buildNumber = R.view(
        buildNumberAccessor,
        lambdaDataObject
    );
    const flavourId = R.view(
        flavourIdAccessor,
        lambdaDataObject
    );

    return {
        pipelineName,
        buildNumber,
        flavourId,
    };
};

module.exports = {
    s3BucketAccessor,
    s3FileToDownloadFilePathAccessor,
    s3BuildOutputFilePathAccessor,
    s3ChocoFilePathAccessor,
    s3ExtendCssFilePathAccessor,
    s3FolderAccessor,
    localExtractedFolderPathAccessor,
    localChocoFilePathAccessor,
    localExtendCssFilePathAccessor,
    localToBuildFolderPathAccessor,
    localToBuildPackageJsonFilePathAccessor,
    localToBuildDistFolderPathAccessor,
    localAfterBuildFolderPathAccessor,
    localAfterBuildPackageJsonFilePathAccessor,
    localAfterBuildDistFolderPathAccessor,
    getBuildParams,
    coreEnginePackageJsonFilePathPathAccessor,
};
