import test from 'ava';
import {
    stub,
    assert,
} from 'sinon';

import { journeyTrackerPoster } from './postToJourneyTracker';

test.beforeEach(t => {
    t.context.apiEndpoint = 'www.journeytracker.com';
    t.context.s3Directory = 's3Directory';
    t.context.s3Bucket = 's3Bucket';

    t.context.request = stub().returns('request object');
    t.context.postRequest = journeyTrackerPoster(
        t.context.request,
        t.context.apiEndpoint,
        {
            journeyTrackerData: 'journey data',
            s3Bucket: t.context.s3Bucket,
            s3Directory: t.context.s3Key,
        }
    );
});

test(
    'it calls request function with journey tracker data, s3 key, and s3 bucket',
    t => {
        const expectedBody = JSON.stringify({
            data: 'journey data',
            s3Bucket: t.context.s3Bucket,
            s3Directory: t.context.s3Key,
        });

        const expectedRequest = {
            method: 'POST',
            url: t.context.apiEndpoint,
            body: expectedBody,
        };

        assert.calledOnce(t.context.request);
        assert.calledWithExactly(
            t.context.request,
            expectedRequest
        );
        t.pass();
    }
);

test('it returns request object', t => {
    t.is(
        t.context.postRequest,
        'request object'
    );
});
