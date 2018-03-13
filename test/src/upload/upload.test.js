import test from 'ava';
import {
    spy,
    assert,
} from 'sinon';
import R from 'ramda';

import { uploader } from './upload';

test('pipe the function correctly', async t => {
    const identityLens = R.lens(
        R.identity,
        R.identity
    );

    const folderCompressor = (arg, a) => a * 2;
    const fileUploader     = path => a => a * 4; // eslint-disable-line no-unused-vars
    const logUploadTar     = a => a + 4;

    const folderCompressorSpy = spy(folderCompressor);
    const fileUploaderSpy = spy(fileUploader);


    const input = 2;

    const output = await uploader(
        identityLens,
        folderCompressorSpy,
        fileUploaderSpy,
        R.identity,
        { uploadTar: logUploadTar },
        input
    );

    const expectedOutput = input;

    t.is(
        expectedOutput,
        output
    );
    assert.calledOnce(folderCompressorSpy);
    assert.calledWithExactly(
        folderCompressorSpy,
        'tar',
        input + 4
    );
    assert.calledOnce(fileUploaderSpy);
    assert.calledWithExactly(
        fileUploaderSpy,
        input
    );
});
