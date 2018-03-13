import {
    partial,
    identity,
} from 'ramda';
import test from 'ava';
import { assert, stub } from 'sinon';

import { coreEngineBuilder } from './index';

const lambdaDataObject = { local: {
    tmpFolder: '<ephemeral-storage>',
} };

const parser = () => () => lambdaDataObject;
const requiredEnvVars = [];
const checkVariables = stub();
const env = {};
const logStep = {
    parser: identity,
    storeLambdaObject: identity,
    beginLog: identity,
    download: identity,
    build: identity,
    move: identity,
    upload: identity,
    updateJourneyTracker: identity,
    endLog: identity,
    success: identity,
};

test.beforeEach(t => {
    t.context.removeTmpDir = stub();
    t.context.event = {};
    t.context.eventContext = {};
    t.context.callback = stub();

    t.context.build = partial(
        coreEngineBuilder,
        [
            requiredEnvVars,
            checkVariables,
            parser,
            identity,
            identity,
            identity,
            identity,
            identity,
            logStep,
            identity,
            identity,
            identity,
            env,
            t.context.removeTmpDir,
        ]
    );
});

test('if building succeeds, it calls removeTmpDir', async t => {
    const {
        build,
        removeTmpDir,
    } = t.context;

    await build(
        {},
        {},
        () => {}
    );

    assert.calledOnce(removeTmpDir);
    assert.calledWithExactly(removeTmpDir, '<ephemeral-storage>');
    t.pass();
});

test('if building fails, it calls removeTmpDir', async t => {
    const { removeTmpDir } = t.context;

    // Mocking an error thrown by checkVariables.
    await coreEngineBuilder(
        [],
        () => arg => Promise.reject(arg),
        parser,
        null,
        null,
        null,
        null,
        null,
        logStep,
        null,
        null,
        stub(),
        null,
        removeTmpDir,
        {},    // event
        {},    // context
        stub() // callback
    );

    assert.calledOnce(removeTmpDir);
    assert.calledWithExactly(removeTmpDir, '<ephemeral-storage>');
    t.pass();
});
