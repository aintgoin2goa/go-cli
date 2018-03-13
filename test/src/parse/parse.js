const R = require('ramda');

const parseEvent = require('./parseEvent');
const createLambdaDataObject = require('../utils/model/createLambdaDataObject');

const parser = (
    triggerEventParser,
    lambdaDataCreator,
    processEnv,
    event
) => {
    const createLambdaDataObject = R.curry(lambdaDataCreator)(processEnv);

    const parse = R.pipe(
        triggerEventParser,
        createLambdaDataObject
    );

    return parse(
        event,
        processEnv
    );
};

const parse = R.curry(parser)(
    parseEvent,
    createLambdaDataObject
);

module.exports = parse;
module.exports.parser = parser;
