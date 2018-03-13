import test from 'ava';
import {
    stub,
    assert,
} from 'sinon';
import mock from 'mock-require';

import requireWithEnvVar from '../test/requireWithEnvVar';

const requestStub = stub();
mock('request', requestStub);

const {
    logBegin,
    logEnd,
    logError,
} = requireWithEnvVar(
    require,
    './log'
);

const {
    PIPELINE_STEP_NAME,
    BEGIN_MESSAGE,
    END_MESSAGE,
} = require('../../dictionary');

test.beforeEach(t => {
    t.context.requestStub = requestStub;
    t.context.requestStub.reset();
    t.context.pipelineStep = PIPELINE_STEP_NAME;
    t.context.beginMessage = BEGIN_MESSAGE;
    t.context.endMessage = END_MESSAGE;
    t.context.errorMessage = 'something exploded';

    const pipelineName = 'dazn-web-test';
    const flavourId = 'de_web_catalog';
    const buildNumber = '123';
    t.context.pipelineName = pipelineName;
    t.context.flavourId = flavourId;
    t.context.buildNumber = buildNumber;

    t.context.pipelineParams = {
        pipelineName,
        flavourId,
        buildNumber,
    };

    t.context.loggerEndpoint = process.env.LOGGER_ENDPOINT;
    t.context.environment = process.env.ENVIRONMENT;
});

test('log begin is calling request', t => {
    const {
        pipelineName,
        flavourId,
        buildNumber,
        pipelineStep,
        beginMessage,
        pipelineParams,
        loggerEndpoint,
        environment,
    } = t.context;

    const requestOptions = {
        pipelineName,
        flavourId,
        buildNumber,
        pipelineStep,
        environment,
        message: {
            error: false,
            text: beginMessage,
        },
    };

    const request = {
        method: 'POST',
        json: true,
        body: requestOptions,
        url: loggerEndpoint,
    };

    logBegin(pipelineParams);

    assert.calledOnce(t.context.requestStub);
    assert.calledWithExactly(
        t.context.requestStub,
        request
    );
    t.pass();
});

test('log end is calling request', t => {
    const {
        pipelineName,
        flavourId,
        buildNumber,
        pipelineStep,
        endMessage,
        pipelineParams,
        loggerEndpoint,
        environment,
    } = t.context;

    const requestOptions = {
        pipelineName,
        flavourId,
        buildNumber,
        pipelineStep,
        environment,
        message: {
            error: false,
            text: endMessage,
        },
    };

    const request = {
        method: 'POST',
        json: true,
        body: requestOptions,
        url: loggerEndpoint,
    };

    logEnd(pipelineParams);

    assert.calledOnce(t.context.requestStub);
    assert.calledWithExactly(
        t.context.requestStub,
        request
    );
    t.pass();
});

test('log error is calling request with message', t => {
    const {
        pipelineName,
        flavourId,
        buildNumber,
        pipelineStep,
        pipelineParams,
        loggerEndpoint,
        environment,
        errorMessage,
    } = t.context;

    const requestOptions = {
        pipelineName,
        flavourId,
        buildNumber,
        pipelineStep,
        environment,
        message: {
            error: true,
            text: errorMessage,
        },
    };

    const request = {
        method: 'POST',
        json: true,
        body: requestOptions,
        url: loggerEndpoint,
    };

    logError(
        pipelineParams,
        errorMessage
    );

    assert.calledOnce(t.context.requestStub);
    assert.calledWithExactly(
        t.context.requestStub,
        request
    );
    t.pass();
});
