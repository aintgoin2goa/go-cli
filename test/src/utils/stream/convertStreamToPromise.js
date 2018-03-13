const R = require('ramda');

const convertStreamToPromise = stream => {
    const innerPromiseFunction = (
        resolve,
        reject
    ) => {
        stream.on(
            'finish',
            resolve
        );
        stream.on(
            'error',
            error => reject(new Error(error))
        );
    };

    return new Promise(innerPromiseFunction);
};


const streamToPromiseConverterAndOverrider = (
    streamToPromiseConverter,
    promiseResolvedReturnValue,
    promiseRejectedReturnValue,
    stream
) => {
    const promise = streamToPromiseConverter(stream);
    return promise.then(
        a => promiseResolvedReturnValue || a,
        a => promiseRejectedReturnValue || a
    );
};

/**
 * Convert and Override Stream to Promise
 *
 * takes a stream as an input and return a promise.
 * you can provide two more parameters for overriding the standard returning values
 * of promises.
 *
 *
 * @param {String} promiseResolvedReturnValue - override promise resolve return value
 * @param {String} promiseRejectReturnValue - override promise reject return value
 * @param {Stream} stream - where to transform from
 *
 *
 * @returns {Promise}
 */
const convertAndOverrideStreamToPromise = R.curry(streamToPromiseConverterAndOverrider)(
    convertStreamToPromise
);

module.exports = convertAndOverrideStreamToPromise;
module.exports.convertStreamToPromise = convertStreamToPromise;
module.exports.streamToPromiseConverterAndOverrider = streamToPromiseConverterAndOverrider;
