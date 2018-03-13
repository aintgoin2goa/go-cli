import test from 'ava';
import {
    spy,
    assert,
} from 'sinon';

import { s3FileUploader } from './uploadFile';

test.beforeEach(t => {
    const upload = () => ({
        promise: () => {},
    });

    t.context.upload = upload;
});

test('triggers s3 get object', t => {
    const upload = spy(t.context.upload);

    const s3ConnectionGetter = () => ({ upload });

    const bodyContent = 'something';

    s3FileUploader(
        s3ConnectionGetter,
        {},
        bodyContent
    );

    const expectedCalledWith = {
        Body: bodyContent,
    };

    assert.calledOnce(upload);
    assert.calledWithExactly(
        upload,
        expectedCalledWith
    );
    t.pass();
});
