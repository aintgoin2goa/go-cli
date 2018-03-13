const log = require('fancy-log');

const consoleLogPipeStep = message => argument => {
    log(message);
    return argument;
};

const parser = consoleLogPipeStep('parser');
const storeLambdaObject = consoleLogPipeStep('store lambda object');
const beginLog = consoleLogPipeStep('begin log');
const download = consoleLogPipeStep('download');
const build = consoleLogPipeStep('build');
const move =  consoleLogPipeStep('move');
const upload = consoleLogPipeStep('upload');
const updateJourneyTracker = consoleLogPipeStep('update journey tracker');
const endLog = consoleLogPipeStep('end log');
const success = consoleLogPipeStep('success callback');

const downloadAbsTar = consoleLogPipeStep('download abs tar');
const downloadChocoJson = consoleLogPipeStep('download choco json');
const downloadExtendCss = consoleLogPipeStep('download extendCss json');

const uploadTar = consoleLogPipeStep('upload tar');

module.exports = Object.assign(consoleLogPipeStep, {
    parser,
    storeLambdaObject,
    beginLog,
    download,
    build,
    move,
    upload,
    updateJourneyTracker,
    endLog,
    success,
    downloadAbsTar,
    downloadChocoJson,
    downloadExtendCss,
    uploadTar,
});
