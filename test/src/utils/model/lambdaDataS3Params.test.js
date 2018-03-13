import test from 'ava';

import {
    getS3GetObjectParamsForABSOutputFile,
    getS3GetObjectParamsForChocoJsonFile,
    getS3GetObjectParamsForExtendCssJsonFile,
    getS3PutObjectParamsForBuildOutputFile,
} from './lambdaDataS3Params';

test('getS3GetObjectParamsForABSOutputFile returns correct object', t => {
    const input = {
        s3: {
            fileToDownloadFilePath: 'some/file/to/download',
            bucket: 'some-bucket',
            unused: 'unused param',
        },
    };

    const output = getS3GetObjectParamsForABSOutputFile(input);

    t.deepEqual(
        output,
        {
            Key: 'some/file/to/download',
            Bucket: 'some-bucket',
        }
    );
});

test('getS3GetObjectParamsForChocoJsonFile returns correct object', t => {
    const input = {
        s3: {
            chocoFilePath: 'some/choco/file/path',
            bucket: 'some-bucket',
            unused: 'unused param',
        },
    };

    const output = getS3GetObjectParamsForChocoJsonFile(input);

    t.deepEqual(
        output,
        {
            Key: 'some/choco/file/path',
            Bucket: 'some-bucket',
        }
    );
});

test('getS3GetObjectParamsForExtendCssJsonFile returns correct object', t => {
    const input = {
        s3: {
            extendCssFilePath: 'some/extendCss/file/path',
            bucket: 'some-bucket',
            unused: 'unused param',
        },
    };

    const output = getS3GetObjectParamsForExtendCssJsonFile(input);

    t.deepEqual(
        output,
        {
            Key: 'some/extendCss/file/path',
            Bucket: 'some-bucket',
        }
    );
});

test('getS3PutObjectParamsForBuildOutputFile returns correct object', t => {
    const input = {
        s3: {
            buildOutputFilePath: 'some/build/output/file/path',
            bucket: 'some-bucket',
            unused: 'unused param',
        },
    };

    const output = getS3PutObjectParamsForBuildOutputFile(input);
    t.deepEqual(
        output,
        {
            Key: 'some/build/output/file/path',
            Bucket: 'some-bucket',
        }
    );
});
