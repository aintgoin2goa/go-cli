import test from 'ava';

import { folderCompressor } from './compressFolder';


test('using "tar" compression type triggers tar compressor', t => {
    const input = 1;

    const output = folderCompressor(
        a => a + 3,
        'tar',
        input
    );

    const expectedOutput = input + 3;
    t.is(
        output,
        expectedOutput
    );
});

test('using not supported compression returns null', t => {
    const input = 1;

    const output = folderCompressor(
        a => a + 3,
        'zip',
        input
    );

    const expectedOutput = null;
    t.is(
        output,
        expectedOutput
    );
});
