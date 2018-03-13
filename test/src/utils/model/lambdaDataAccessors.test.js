import test from 'ava';
import R from 'ramda';

import {
    s3BucketAccessor,
    s3FileToDownloadFilePathAccessor,
    s3BuildOutputFilePathAccessor,
    s3ChocoFilePathAccessor,
    s3ExtendCssFilePathAccessor,
    s3FolderAccessor,
    localExtractedFolderPathAccessor,
    localChocoFilePathAccessor,
    localExtendCssFilePathAccessor,
    localToBuildFolderPathAccessor,
    localToBuildPackageJsonFilePathAccessor,
    localToBuildDistFolderPathAccessor,
    localAfterBuildFolderPathAccessor,
    localAfterBuildPackageJsonFilePathAccessor,
    localAfterBuildDistFolderPathAccessor,
    getBuildParams,
    coreEnginePackageJsonFilePathPathAccessor,

} from './lambdaDataAccessors';

test('provides proper params from getBuildParams', t => {
    const mockBuildParams = {
        pipelineName: 'dazn-web-test',
        flavourId: 'de_web_catalog',
        buildNumber: '123',
    };

    const output = getBuildParams({
        build: {
            name: 'dazn-web-test',
            flavourId: 'de_web_catalog',
            number: '123',
        },
    });

    t.deepEqual(
        output,
        mockBuildParams
    );
});

test('getBuildParams returns error if lamda object is not provided', t => {
    const output = getBuildParams(null);

    t.is(
        output,
        'error_while_parsing_event'
    );
});

test('can access s3 properties', t => {
    const properties = [{
        accessor: s3BucketAccessor,
        mock: 'some bucket',
        key: 'bucket',
    }, {
        accessor: s3FileToDownloadFilePathAccessor,
        mock: 'some/to/download/file/path',
        key: 'fileToDownloadFilePath',
    },{
        accessor: s3BuildOutputFilePathAccessor,
        mock: 'some/output/file/path',
        key: 'buildOutputFilePath',
    }, {
        accessor: s3ChocoFilePathAccessor,
        mock: 'choco/file/path',
        key: 'chocoFilePath',
    }, {
        accessor: s3ExtendCssFilePathAccessor,
        mock: 'extend/css/file/path',
        key: 'extendCssFilePath',
    }, {
        accessor: s3FolderAccessor,
        mock: 'some/s3/folder',
        key: 'triggerFileFolder',
    }];

    properties.forEach(property => {
        const mockData = {
            s3: {
                [property.key]: property.mock,
            },
        };

        const result = R.view(
            property.accessor,
            mockData
        );

        t.is(
            result,
            property.mock
        );
    });
});

test('can access local properties', t => {
    const properties = [{
        accessor: localExtractedFolderPathAccessor,
        mock: 'extracted/folder/path',
        key: 'extractedFolderPath',
    }, {
        accessor: localChocoFilePathAccessor,
        mock: 'choco/file/path',
        key: 'chocoFilePath',
    }, {
        accessor: localExtendCssFilePathAccessor,
        mock: 'extend/css/file/path',
        key: 'extendCssFilePath',
    }, {
        accessor: localToBuildFolderPathAccessor,
        mock: 'to/build/folder/path',
        key: 'toBuildFolderPath',
    }, {
        accessor: localToBuildPackageJsonFilePathAccessor,
        mock: 'to/build/package.json',
        key: 'toBuildPackageJsonFilePath',
    }, {
        accessor: localToBuildDistFolderPathAccessor,
        mocks: 'to/build/dist/folder',
        key: 'toBuildDistFolderPath',
    }, {
        accessor: localAfterBuildFolderPathAccessor,
        mock: 'after/build/node/modules',
        key: 'afterBuildFolderPath',
    }, {
        accessor: localAfterBuildPackageJsonFilePathAccessor,
        mock: 'after/build/package.json',
        key: 'afterBuildPackageJsonFilePath',
    }, {
        accessor: localAfterBuildDistFolderPathAccessor,
        mock: 'after/build/dist/folder',
        key: 'afterBuildDistFolderPath',
    }, {
        accessor: coreEnginePackageJsonFilePathPathAccessor,
        mock: 'core/engine/package/json',
        key: 'coreEnginePackageJsonFilePath',
    }];

    properties.forEach(property => {
        const mockData = {
            local: {
                [property.key]: property.mock,
            },
        };

        const result = R.view(
            property.accessor,
            mockData
        );

        t.is(
            result,
            property.mock
        );
    });
});
