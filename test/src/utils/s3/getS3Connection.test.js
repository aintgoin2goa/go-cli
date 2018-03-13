import test from 'ava';
import {
    stub,
    assert,
} from 'sinon';
import AWS from 'aws-sdk';

import { getS3Connection } from './getS3Connection';

test('calls AWS.S3 with no parameters', t => {
    const s3Stub = stub(
        AWS,
        'S3'
    );

    getS3Connection();

    assert.calledOnce(s3Stub);
    assert.calledWithExactly(
        s3Stub
    );
    s3Stub.restore();
    t.pass();
});
