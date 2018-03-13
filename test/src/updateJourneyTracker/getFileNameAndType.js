const getFileNameAndType = fileName => ({
    name: fileName,
    type: fileName.split('.').pop(),
});

module.exports = getFileNameAndType;

