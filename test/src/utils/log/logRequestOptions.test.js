import test from 'ava';

import {
    getLogBeginOptions,
    getLogEndOptions,
    getLogErrorOptions,
} from './logRequestOptions';
import {
    PIPELINE_STEP_NAME,
    BEGIN_MESSAGE,
    END_MESSAGE,
} from '../../dictionary';

test('returns request options for logging the start', t => {
    const url = 'www.google.com';
    const environment = 'test';
    const pipelineParams = {
        pipelineName: 'dazn-web-test',
        flavourId: 'de_web_catalog',
        buildNumber: '123',
    };
    const requestOptions = getLogBeginOptions(
        url,
        environment,
        pipelineParams
    );

    const expectedBody = {
        pipelineName: pipelineParams.pipelineName,
        flavourId: pipelineParams.flavourId,
        buildNumber: pipelineParams.buildNumber,
        pipelineStep: PIPELINE_STEP_NAME,
        environment,
        message: {
            error: false,
            text: BEGIN_MESSAGE,
        },
    };

    const expectedOptions = {
        method: 'POST',
        body: expectedBody,
        json: true,
        url,
    };

    t.deepEqual(
        requestOptions,
        expectedOptions
    );
});

test('returns request options for logging the end', t => {
    const url = 'www.lycos.co.uk';
    const environment = 'dev';
    const pipelineParams = {
        pipelineName: 'dazn-web-test',
        flavourId: 'de_web_catalog',
        buildNumber: '123',
    };
    const requestOptions = getLogEndOptions(
        url,
        environment,
        pipelineParams
    );

    const expectedBody = {
        pipelineName: pipelineParams.pipelineName,
        flavourId: pipelineParams.flavourId,
        buildNumber: pipelineParams.buildNumber,
        pipelineStep: PIPELINE_STEP_NAME,
        environment,
        message: {
            error: false,
            text: END_MESSAGE,
        },
    };

    const expectedOptions = {
        method: 'POST',
        body: expectedBody,
        json: true,
        url,
    };

    t.deepEqual(
        requestOptions,
        expectedOptions
    );
});

test('returns request options for logging an error', t => {
    const url = 'www.lycos.co.uk';
    const environment = 'prod';
    const pipelineParams = {
        pipelineName: 'dazn-web-test',
        flavourId: 'de_web_catalog',
        buildNumber: '123',
    };
    const errorText = 'OMG there\'s an error!';
    const requestOptions = getLogErrorOptions(
        errorText,
        url,
        environment,
        pipelineParams
    );

    const expectedBody = {
        pipelineName: pipelineParams.pipelineName,
        flavourId: pipelineParams.flavourId,
        buildNumber: pipelineParams.buildNumber,
        pipelineStep: PIPELINE_STEP_NAME,
        environment,
        message: {
            error: true,
            text: errorText,
        },
    };

    const expectedOptions = {
        method: 'POST',
        body: expectedBody,
        json: true,
        url,
    };

    t.deepEqual(
        requestOptions,
        expectedOptions
    );
});
