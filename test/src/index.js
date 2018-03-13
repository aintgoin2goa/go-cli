'use strict';
Error.stackTraceLimit = Infinity;
const fs = require('fs');

const R = require('ramda');

const consoleLogPipeStep = require('./utils/consoleLog/consoleLogPipeStep');
const {
    tappedLogBeginWithLambdaData,
    tappedLogEndWithLambdaData,
    logErrorWithLambdaDataAndMessage,
} = require('./utils/log/log');
const parse = require('./parse/parse');
const download = require('./download/download');
const build = require('./build/build');
const move = require('./move/move');
const upload = require('./upload/upload');
const { checkVariables } = require('./utils/checkVariables');
const removeTmpDir = require('./utils/filesystem/removeTmpDir');
let updateJourneyTracker = require('./updateJourneyTracker/updateJourneyTracker');

updateJourneyTracker = R.curry(updateJourneyTracker)(process.env.JOURNEY_TRACKER_API_ENDPOINT);

const REQUIRED_ENV_VARS = [
    'JOURNEY_TRACKER_API_ENDPOINT',
    'LOGGER_ENDPOINT',
    'ENVIRONMENT',
    'REMOTE_EXTEND_CSS_FILE_NAME',
    'REMOTE_FILE_TO_DOWNLOAD_FILE_NAME',
    'REMOTE_CORE_ENGINE_FILE_NAME',
    'LOCAL_PROJECT_TO_BUILD_ROOT_FOLDER',
    'LOCAL_PROJECT_TO_BUILD_SOURCE_FOLDER',
    'LOCAL_PROJECT_FOLDER_AFTER_ALL_BUILD_STEPS',
    'LOCAL_TMP_FOLDER',
    'LOCAL_ROOT_FOLDER',
];

const coreEngineBuilder = (
    requiredEnvVars,
    checkVariables,
    parser,
    downloader,
    builder,
    mover,
    uploader,
    updater,
    logStep,
    tappedBeginLoggerWithLambdaData,
    tappedEndLoggerWithLambdaData,
    errorLoggerWithLambdaDataAndMessage,
    processEnv,
    removeTmpDir,
    event,
    context,
    callback
) => {
    try {
        checkVariables(processEnv, REQUIRED_ENV_VARS);
    } catch (error) {
        return callback(error);
    }

    const successCallback = R.partial(
        callback,
        [
            null,
            'LAMBDA JOB IS DONE',
        ]
    );

    let lambdaDataObject = null;
    const storeLambdaDataObject = dataToStore => lambdaDataObject = dataToStore;
    const tappedStoreLambdaDataObject = R.tap(storeLambdaDataObject);
    const parserWithProcessEnv = parser(processEnv);

    const coreEngineBuild = R.pipeP(
        argument => Promise.resolve(argument),
        parserWithProcessEnv,
        logStep.storeLambdaObject,
        tappedStoreLambdaDataObject,
        logStep.beginLog,
        tappedBeginLoggerWithLambdaData,
        logStep.download,
        downloader,
        logStep.build,
        builder,
        logStep.move,
        mover,
        logStep.upload,
        uploader,
        logStep.updateJourneyTracker,
        updater,
        logStep.endLog,
        tappedEndLoggerWithLambdaData,
        logStep.success,
        successCallback
    );

    logStep.parser();

    return coreEngineBuild(event)
       
        .catch(err => {
            const error = err.stack ? err.stack : err;
            // eslint-disable-next-line no-console
            console.error(error);
            errorLoggerWithLambdaDataAndMessage(
                lambdaDataObject,
                `${error}`
            );
            callback(error);
        })
        .then(() => {
            console.log('tmp BEFORE', fs.readdirSync(process.env.LOCAL_TMP_FOLDER)); // eslint-disable-line no-console
        })
        .then(() => removeTmpDir(lambdaDataObject.local.tmpFolder))
        .then(() => {
            console.log('tmp  AFTER', fs.readdirSync(process.env.LOCAL_TMP_FOLDER)); // eslint-disable-line no-console
        });
};

const buildCoreEngine = R.partial(
    coreEngineBuilder,
    [
        REQUIRED_ENV_VARS,
        checkVariables,
        parse,
        download,
        build,
        move,
        upload,
        updateJourneyTracker,
        consoleLogPipeStep,
        tappedLogBeginWithLambdaData,
        tappedLogEndWithLambdaData,
        logErrorWithLambdaDataAndMessage,
        process.env,
        removeTmpDir,
    ]
);

exports.handler = buildCoreEngine;
exports.coreEngineBuilder = coreEngineBuilder;
