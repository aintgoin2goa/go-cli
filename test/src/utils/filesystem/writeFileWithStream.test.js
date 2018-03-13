import fs from 'fs';

import R from 'ramda';
import test from 'ava';
import {
    stub,
    assert,
} from 'sinon';

import { fileWriterWithStream } from './writeFileWithStream';

test('calls fs.createWriteStream and pipes the stream', t => {
    const inputA = 2;
    const inputB = 3;

    const createWriteStreamStub = stub(
        fs,
        'createWriteStream'
    ).callsFake(R.identity);

    const output = fileWriterWithStream(
        R.multiply,
        inputA,
        inputB
    );

    const expectedOutput = inputA * inputB;

    t.is(
        output,
        expectedOutput
    );
    assert.calledOnce(createWriteStreamStub);
    assert.calledWithExactly(
        createWriteStreamStub,
        inputA
    );

    createWriteStreamStub.restore();
});

test('throws if fs.createWriteStream throws an error', t => {
    const inputA = 2;
    const inputB = 3;

    const createWriteStreamStub = stub(
        fs,
        'createWriteStream'
    ).throws(new Error('some error'));

    const error = t.throws(
        () => {
            fileWriterWithStream(
                R.multiply,
                inputA,
                inputB
            );
        }
    );
    t.deepEqual(
        error,
        new Error('some error')
    );
    createWriteStreamStub.restore();
});
