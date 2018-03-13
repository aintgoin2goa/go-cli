const R = require('ramda');

const readDirectory = require('./readDirectory');
const {
    localAfterBuildFolderPathAccessor,
    coreEnginePackageJsonFilePathPathAccessor,
    s3BucketAccessor,
    s3FolderAccessor,
} = require('../utils/model/lambdaDataAccessors');
const {
    addPipelineVersionToJourneyTracker,
    addDistFileNamesToJsonBody,
} = require('./addDataToJourneyTracker');
const { postToJourneyTracker } = require('./postToJourneyTracker');

const journeyTrackerUpdater = (
    s3BucketAccessor,
    s3FolderAccessor,
    accesslocalDistFolderPathAccessor,
    accessCoreEnginePackageJsonFilePath,
    readDirectory,
    addPipelineVersionToJsonBody,
    addDistFileNamesToJsonBody,
    postToJourneyTracker,
    journeyTrackerApiEndpoint,
    lambdaDataObject
) => {
    const localDistFolderFilePath = R.view(
        accesslocalDistFolderPathAccessor,
        lambdaDataObject
    );
    const pipelinePackageJsonPath = R.view(
        accessCoreEnginePackageJsonFilePath,
        lambdaDataObject
    );

    const pipelineVersionAdder = R.curry(addPipelineVersionToJsonBody)(pipelinePackageJsonPath);
    const fileNamesGetter      = R.curry(readDirectory)(localDistFolderFilePath);
    const distFilesAdder       = R.curry(addDistFileNamesToJsonBody);

    const s3Bucket = R.view(
        s3BucketAccessor,
        lambdaDataObject
    );

    const s3Directory = R.view(
        s3FolderAccessor,
        lambdaDataObject
    );

    const resolvePromiseWithArityOfTwo = R.nAry(
        2,
        Promise.resolve.bind(Promise)
    );
    const returnLambdaDataObjectViaPromise = R.curry(resolvePromiseWithArityOfTwo)(
        lambdaDataObject
    );

    const post = journeyTrackerData =>
        postToJourneyTracker(
            journeyTrackerApiEndpoint,
            {
                journeyTrackerData,
                s3Bucket,
                s3Directory,
            }
        );

    const updateJourneyTracker = R.pipeP(
        argument => Promise.resolve(argument),
        pipelineVersionAdder,
        fileNamesGetter,
        distFilesAdder,
        post,
        returnLambdaDataObjectViaPromise
    );

    return updateJourneyTracker({});
};

const updateJourneyTracker = R.partial(
    journeyTrackerUpdater,
    [
        s3BucketAccessor,
        s3FolderAccessor,
        localAfterBuildFolderPathAccessor,
        coreEnginePackageJsonFilePathPathAccessor,
        readDirectory,
        addPipelineVersionToJourneyTracker,
        addDistFileNamesToJsonBody,
        postToJourneyTracker,
    ]
);

module.exports = updateJourneyTracker;
module.exports.journeyTrackerUpdater = journeyTrackerUpdater;
