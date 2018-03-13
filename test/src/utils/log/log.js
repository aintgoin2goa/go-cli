const request = require('request');
const R = require('ramda');

const {
    getLogBeginOptions,
    getLogEndOptions,
    getLogErrorOptions,
} = require('./logRequestOptions');
const { getBuildParams } = require('../model/lambdaDataAccessors');

const loggerWithMessage = (
    loggerOptionsGetter,
    url,
    environment,
    pipelineParams,
    message
) => {
    const requestOptions = loggerOptionsGetter(
        message,
        url,
        environment,
        pipelineParams
    );
    return request(requestOptions);
};


const logger = (
    loggerOptionsGetter,
    url,
    environment,
    pipelineParams
) => {
    const requestOptions = loggerOptionsGetter(
        url,
        environment,
        pipelineParams
    );

    return request(requestOptions);
};

/**
 * Log begin
 *
 * @param {Object} pipelineParams - pipeline parameters, including id, number, name
 *
 * @returns {Function}
 */
const logBegin = R.curry(logger)(
    getLogBeginOptions,
    process.env.LOGGER_ENDPOINT,
    process.env.ENVIRONMENT
);

const beginLoggerWithLambdaData = R.pipe(
    getBuildParams,
    logBegin
);

/**
 * Log end
 *
 * @param {Object} pipelineParams - pipeline parameters, including id, number, name
 *
 * @returns {Function}
 */
const logEnd = R.curry(logger)(
    getLogEndOptions,
    process.env.LOGGER_ENDPOINT,
    process.env.ENVIRONMENT
);
const endLoggerWithLambdaData = R.pipe(
    getBuildParams,
    logEnd
);

/**
 * Log errors
 *
 * @param {Object} pipelineParams - pipeline parameters, including id, number, name
 * @param {String} message - error message
 *
 * @returns {Function}
 */
const logError = R.curry(loggerWithMessage)(
    getLogErrorOptions,
    process.env.LOGGER_ENDPOINT,
    process.env.ENVIRONMENT
);

const errorLoggerWithLambdaDataAndMessage = (
    errorLogger,
    getBuildParams,
    lambdaDataObject,
    errorMessage
) => {
    const uniqueId = getBuildParams(
        lambdaDataObject
    );
    errorLogger(
        uniqueId,
        errorMessage
    );
};
/**
 * Log Error with LambdaData and Message
 *
 * @param {Object} lambdaData - standard data in the lambda
 * @param {String} message - error message
 *
 * @returns {Function}
 */
const logErrorWithLambdaDataAndMessage = R.curry(errorLoggerWithLambdaDataAndMessage)(
    logError,
    getBuildParams
);

const tappedLogBeginWithLambdaData = R.tap(beginLoggerWithLambdaData);
const tappedLogEndWithLambdaData = R.tap(endLoggerWithLambdaData);

module.exports = {
    logBegin,
    logEnd,
    logError,
    tappedLogBeginWithLambdaData,
    tappedLogEndWithLambdaData,
    logErrorWithLambdaDataAndMessage,
};
