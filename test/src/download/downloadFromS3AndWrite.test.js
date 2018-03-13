import test from 'ava';
import R from 'ramda';
import {
    spy,
    assert,
} from 'sinon';

import { downloaderAndWriter } from './downloadFromS3AndWrite';

test('pipes correctly the passed functions', t => {
    const start = 1;

    const addOne = (a, b) => R.add(1); // eslint-disable-line no-unused-vars
    const divideByTwo = a => R.divide(2); // eslint-disable-line no-unused-vars

    const divideByTwoSpy = spy(divideByTwo);
    const addOneSpy = spy(addOne);

    const output = downloaderAndWriter(
        R.add(1),
        divideByTwoSpy,
        addOneSpy,
        start,
        null
    );

    const expectedOutput = (start + 1) / 2 + 1;

    assert.calledOnce(divideByTwoSpy);
    assert.calledWithExactly(
        divideByTwoSpy,
        null
    );
    assert.calledOnce(addOneSpy);
    assert.calledWithExactly(
        addOneSpy,
        null,
        null
    );

    t.is(
        output,
        expectedOutput
    );
});
