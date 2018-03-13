const R = require('ramda');

const {
    PIPELINE_STEP_NAME,
    BEGIN_MESSAGE,
    END_MESSAGE,
} = require('../../dictionary');

const logOptionsGetter = (
    errorBool,
    messageText,
    url,
    environment,
    pipelineParams
) => {
    const {
        pipelineName,
        flavourId,
        buildNumber,
    } = pipelineParams;

    const body = {
        pipelineName,
        flavourId,
        buildNumber,
        pipelineStep: PIPELINE_STEP_NAME,
        environment,
        message: {
            error: errorBool,
            text: messageText,
        },
    };

    return {
        method: 'POST',
        json: true,
        body,
        url,
    };
};

/**
 * Get Log Begin Options
 *
 * @params {String} url - logger lambda url
 * @params {String} environment (eg. dev)
 * @params {String} pipelineParams - pipeline paramms (eg. id)
 *
 * @returns {Object}
 */
const getLogBeginOptions = R.curry(logOptionsGetter)(
    false,
    BEGIN_MESSAGE
);

/**
 * Get Log End Options
 *
 * @params {String} url - logger lambda url
 * @params {String} environment (eg. dev)
 * @params {String} pipelineParams - pipeline paramms (eg. id)
 *
 * @returns {Object}
 */
const getLogEndOptions = R.curry(logOptionsGetter)(
    false,
    END_MESSAGE
);

/**
 * Get Log Error Options
 *
 * @params {String} messageText - error message to show in the logger
 * @params {String} url - logger lambda url
 * @params {String} environment (eg. dev)
 * @params {String} pipelineParams - pipeline paramms (eg. id)
 *
 * @returns {Object}
 */
const getLogErrorOptions = R.curry(logOptionsGetter)(
    true
);

module.exports = {
    getLogBeginOptions,
    getLogEndOptions,
    getLogErrorOptions,
};
