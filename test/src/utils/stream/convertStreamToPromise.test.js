import test from 'ava';
import {
    spy,
    assert,
} from 'sinon';

import {
    convertStreamToPromise,
    streamToPromiseConverterAndOverrider,
} from './convertStreamToPromise';

test('convert strem to promise return a promise', async t => {
    const streamOn = (
        event,
        listener
    ) => {
        if (event === 'finish') {
            listener();
        }
    };
    const on = spy(streamOn);

    const mockStream = { on };

    await convertStreamToPromise(
        mockStream
    );

    assert.calledTwice(on);
    assert.calledWith(
        on,
        'finish',
    );
    assert.calledWith(
        on,
        'error',
    );
    t.pass();
});

test('override promise resolved variables correctly', async t => {
    const input = 1;

    const output = await streamToPromiseConverterAndOverrider(
        a => Promise.resolve(a + 1),
        36,
        null,
        input
    );
    const expectedOutput = 36;
    t.is(
        output,
        expectedOutput
    );
});

test('override promise rejected variables correctly', async t => {
    const input = 1;

    const output = await streamToPromiseConverterAndOverrider(
        () => Promise.reject(new Error('useless')),
        null,
        117,
        input
    );
    const expectedOutput = 117;

    t.is(
        output,
        expectedOutput
    );
});
