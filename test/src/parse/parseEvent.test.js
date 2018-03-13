import test from 'ava';

import parseEvent from './parseEvent';
import payload from '../../mocks/payload.test';
import payloadWithBranch from '../../mocks/payloadWithBranch.test';

test('should return correct object', t => {
    const expected = {
        s3Bucket: 'dazn-tube-testing',
        // eslint-disable-next-line max-len
        s3Key: 'web-dazn/testing-web_dazn-build-develop/94/multiplier/jp_web_catalog/choco_multiplier_station.json',
        s3Region: 'eu-west-2',
        projectName: 'web-dazn',
        pipelineName: 'testing-web_dazn-build-develop',
        buildNumber: '94',
        flavourId: 'jp_web_catalog',
        filename: 'choco_multiplier_station.json',
        country: 'jp',
        target: 'web',
        chapter: 'catalog',
        folderPath: 'web-dazn/testing-web_dazn-build-develop/94/multiplier/jp_web_catalog',
        pipelineFolderPath: 'web-dazn/testing-web_dazn-build-develop/94',
    };
    const result = parseEvent(payload);

    t.deepEqual(
        result,
        expected
    );
});

test('should return correct object for payload with branch', t => {
    const expected = {
        s3Bucket: 'dazn-tube-testing',
        // eslint-disable-next-line max-len
        s3Key: 'web-dazn/fake-web-dazn-build/feature%2FVELCRO-349/20/multiplier/de_web_catalog/choco_multiplier_station.json',
        s3Region: 'eu-west-2',
        projectName: 'web-dazn',
        pipelineName: 'fake-web-dazn-build',
        buildNumber: '20',
        flavourId: 'de_web_catalog',
        filename: 'choco_multiplier_station.json',
        country: 'de',
        target: 'web',
        chapter: 'catalog',
        // eslint-disable-next-line max-len
        folderPath: 'web-dazn/fake-web-dazn-build/feature%2FVELCRO-349/20/multiplier/de_web_catalog',
        pipelineFolderPath: 'web-dazn/fake-web-dazn-build/feature%2FVELCRO-349/20',
    };
    const result = parseEvent(payloadWithBranch);

    t.deepEqual(
        result,
        expected
    );
});


test('it throws if event doesn\'t contain bucket name', t => {
    const invalidEventObject = {
        Records: [{
            s3: {
                awsRegion: 'some region',
                object: {
                    key: 'some key',
                },
            },
        }],
    };

    const error = t.throws(
        () => parseEvent(invalidEventObject),
    );

    t.deepEqual(
        error,
        new Error('Error parsing event: Missing bucket, key or region')
    );
});

test('it throws if event doesn\'t contain object key', t => {
    const invalidEventObject = {
        Records: [{
            s3: {
                bucket: {
                    name: 'some name',
                },
                object: {
                    key: 'some key',
                },
            },
        }],
    };

    const error = t.throws(
        () => parseEvent(invalidEventObject)
    );

    t.deepEqual(
        error,
        new Error('Error parsing event: Missing bucket, key or region')
    );
});

test('it throws if event doesn\'t contain region', t => {
    const invalidEventObject = {
        Records: [{
            awsRegion: 'some region',
            s3: {
                bucket: {
                    name: 'some name',
                },
            },
        }],
    };

    const error = t.throws(
        () => parseEvent(invalidEventObject)
    );

    t.deepEqual(
        error,
        new Error('Error parsing event: Missing bucket, key or region')
    );
});
