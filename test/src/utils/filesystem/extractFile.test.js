import test from 'ava';
import R from 'ramda';

import { fileExtractor  } from './extractFile';

test('using "tar" extraction type triggers extractor correctly', t => {
    const inputA = 1;
    const inputB = 2;

    const output = fileExtractor(
        a => a + 3,
        R.multiply,
        'tar',
        inputA,
        inputB
    );

    const expectedOutput = (inputA + 3) * inputB;
    t.is(
        output,
        expectedOutput
    );
});

test('using zip extraction type returns null', t => {
    const inputA = 1;
    const inputB = 2;

    const output = fileExtractor(
        a => a + 3,
        (a, b) => `${a} + ${b}`,
        'zip',
        inputA,
        inputB
    );

    const expectedOutput = '2 + null';
    t.is(
        output,
        expectedOutput
    );
});
