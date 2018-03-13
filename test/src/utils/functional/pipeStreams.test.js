import test from 'ava';
import R from 'ramda';

import pipeStreams from './pipeStreams';

test('pipes two streams correctly', t => {
    const fakeStream = {
        pipe : R.add(1),
    };

    const output = pipeStreams(
        fakeStream,
        2
    );

    const expectedOutput = 1 + 2;

    t.is(
        output,
        expectedOutput
    );
});

test('return null if passed variables are not available', t => {
    const output = pipeStreams(
        null,
        2
    );

    const expectedOutput = null;

    t.is(
        output,
        expectedOutput
    );
});

