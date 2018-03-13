const { execSync } = require('child_process');

const unsafeToDelete = dir =>
    dir.indexOf(process.env.LOCAL_TMP_FOLDER) !== 0;

const removeTmpDir = (
    execSync,
    directory
) => {
    console.log('remoteTmpDir', directory);
    if (unsafeToDelete(directory)) {
        throw new Error(
            `Expected to delete a directory under '${process.env.LOCAL_TMP_FOLDER}', but was given '${directory}'.`
        );
    }

    execSync(`rm -rf ${directory}`);
};

module.exports = removeTmpDir.bind(null, execSync);
module.exports.removeTmpDir = removeTmpDir;
