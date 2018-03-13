import test from 'ava';
import {
    spy,
    assert,
} from 'sinon';

import { s3FileDownloader } from './downloadFile';

test.beforeEach(t => {
    const getObject = () => ({
        createReadStream: () => {},
    });

    t.context.getObject = getObject;
});

test('triggers s3 get object', t => {
    const getObject = spy(t.context.getObject);

    const s3ConnectionGetter = () => ({ getObject });

    const input = 1;

    s3FileDownloader(
        s3ConnectionGetter,
        input
    );

    assert.calledOnce(getObject);
    assert.calledWithExactly(
        getObject,
        input
    );
    t.pass();
});
