const {
    mkdirSync,
    renameSync,
} = require('fs');

const R = require('ramda');

const {
    localAfterBuildFolderPathAccessor,
    localToBuildDistFolderPathAccessor,
    localToBuildPackageJsonFilePathAccessor,
    localAfterBuildDistFolderPathAccessor,
    localAfterBuildPackageJsonFilePathAccessor,
} = require('../utils/model/lambdaDataAccessors');

const move = (
    mkdirSync,
    renameSync,
    localAfterBuildFolderPathAccessor,
    localToBuildDistFolderPathAccessor,
    localToBuildPackageJsonFilePathAccessor,
    localAfterBuildDistFolderPathAccessor,
    localAfterBuildPackageJsonFilePathAccessor,
    data
) => {
    const localAfterBuildFolder = R.view(
        localAfterBuildFolderPathAccessor,
        data
    );
    const localDistFolder = R.view(
        localToBuildDistFolderPathAccessor,
        data
    );
    const localAfterBuildDistFolder = R.view(
        localAfterBuildDistFolderPathAccessor,
        data
    );
    const localPackageJson = R.view(
        localToBuildPackageJsonFilePathAccessor,
        data
    );
    const localAfterBuildPackageJson = R.view(
        localAfterBuildPackageJsonFilePathAccessor,
        data
    );

    const moveDistFolder = renameSync.bind(
        null,
        localDistFolder,
        localAfterBuildDistFolder
    );
    const movePackageJson = renameSync.bind(
        null,
        localPackageJson,
        localAfterBuildPackageJson
    );

    mkdirSync(localAfterBuildFolder);
    moveDistFolder();
    movePackageJson();
    return data;
};

module.exports = move.bind(
    null,
    mkdirSync,
    renameSync,
    localAfterBuildFolderPathAccessor,
    localToBuildDistFolderPathAccessor,
    localToBuildPackageJsonFilePathAccessor,
    localAfterBuildDistFolderPathAccessor,
    localAfterBuildPackageJsonFilePathAccessor
);
module.exports.move = move;
