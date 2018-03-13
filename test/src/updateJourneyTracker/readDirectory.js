const fs = require('fs');

const readDirectory = (
    rootDirectoryPath,
    journeyTrackerBody
) =>
    new Promise((
        resolve,
        reject
    ) => {
        fs.readdir(
            rootDirectoryPath,
            (
                err,
                fileNames
            ) => {
                if (err) {
                    return reject(new Error(err));
                }
                return resolve({
                    journeyTrackerBody,
                    fileNames,
                });
            }
        );
    });

module.exports = readDirectory;
