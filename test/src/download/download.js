const R = require('ramda');

const consoleLogPipeStep = require('../utils/consoleLog/consoleLogPipeStep');
const downloadAbsTarFile = require('./downloadAbsTarFile');
const {
    downloadChocoJsonFile,
    downloadExtendCssJsonFile,
} = require('./downloadJsonFiles');

const downloader = (
    absTarFileDownloader,
    chocoJsonFileDownloader,
    extendCssFileDownloader,
    logStep,
    lambdaDataObject
) => {
    const returnLambdaDataObject = () => lambdaDataObject;

    const download = R.pipeP(
        input => Promise.resolve(logStep.downloadAbsTar(input)),
        absTarFileDownloader,
        returnLambdaDataObject,
        logStep.downloadChocoJson,
        chocoJsonFileDownloader,
        returnLambdaDataObject,
        logStep.downloadExtendCss,
        extendCssFileDownloader,
        returnLambdaDataObject
    );

    return download(lambdaDataObject);
};

const download = R.curry(downloader)(
    downloadAbsTarFile,
    downloadChocoJsonFile,
    downloadExtendCssJsonFile,
    consoleLogPipeStep
);

module.exports = download;
module.exports.downloader = downloader;

