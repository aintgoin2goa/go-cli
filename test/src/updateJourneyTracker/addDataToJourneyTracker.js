const R = require('ramda');

const getFileNameAndType = require('./getFileNameAndType');
const {
    VERSIONS_KEY,
    FILES_KEY,
    BUILDER_KEY,
} = require('../utils/constants/constants');

const addPipelineVersionToJourneyTracker = (
    pipelinePackageJsonPath,
    journeyTrackerBody
) =>
    R.mergeDeepWith(
        R.concat,
        journeyTrackerBody,
        { [VERSIONS_KEY]: [
            { [BUILDER_KEY]: require(pipelinePackageJsonPath).version },
        ] }
    );


const addDistFileNamesToJsonBody = ({
    journeyTrackerBody,
    fileNames,
}) => {
    const files = fileNames.map(fileName => getFileNameAndType(fileName));
    return R.mergeDeepWith(
        Object.assign,
        journeyTrackerBody,
        { [FILES_KEY]: { [BUILDER_KEY]: files } }
    );
};

module.exports = {
    addPipelineVersionToJourneyTracker,
    addDistFileNamesToJsonBody,
};
