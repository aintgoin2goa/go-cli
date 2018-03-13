import path from 'path';

import test from 'ava';
import R from 'ramda';

import createLambdaDataObject from './createLambdaDataObject';
import processEnv from '../../../processEnv.js';



const getLocalFolder = (
    buildNumber,
    flavourId
) => path.resolve(
    processEnv.LOCAL_TMP_FOLDER,
    `${buildNumber}_${flavourId}`
);

const getBuildFolder = localFolder => path.resolve(
    localFolder,
    processEnv.LOCAL_PROJECT_FOLDER_AFTER_ALL_BUILD_STEPS
);

const getSourceFolder = localFolder => path.resolve(
    localFolder,
    processEnv.LOCAL_PROJECT_TO_BUILD_ROOT_FOLDER,
    processEnv.LOCAL_PROJECT_TO_BUILD_SOURCE_FOLDER
);


test.beforeEach(t => {
    const s3Bucket = 'hello-bucket';
    const s3Region = 'eu-west-2';
    const s3Key = 'some key';
    const pipelineName = 'dazn-web-test';
    const buildNumber = '13';
    const chapter = 'web';
    const flavourId = 'de_web_auth';
    const filename = 'hello_choco.txt';
    const folderPath = 'a/b/c';
    const pipelineFolderPath = 'd/e/f';

    t.context.input = {
        s3Bucket,
        s3Region,
        s3Key,
        pipelineName,
        buildNumber,
        flavourId,
        chapter,
        filename,
        folderPath,
        pipelineFolderPath,
    };

    t.context.createLambdaDataObject = () => (
        createLambdaDataObject(
            processEnv,
            t.context.input
        )
    );
});


test('lambdaDataObject has a valid "build" object', t => {
    const output = t.context.createLambdaDataObject();

    const expectedOutput = {
        name: t.context.input.pipelineName,
        flavourId: t.context.input.flavourId,
        number: t.context.input.buildNumber,
        chapter: t.context.input.chapter,
        country: t.context.input.country,
    };

    t.deepEqual(
        output.build,
        expectedOutput
    );
});

test('lambdaDataObject has a valid "s3" object', t => {
    const output = t.context.createLambdaDataObject();

    const {
        s3Bucket,
        s3Region,
        filename,
        pipelineFolderPath,
        folderPath,
    } = t.context.input;

    const fileToDownloadFilePath = path.join(
        pipelineFolderPath,
        processEnv.REMOTE_FILE_TO_DOWNLOAD_FILE_NAME
    );

    const expectedOutput = {
        bucket: s3Bucket,
        region: s3Region,
        triggerFileFolder: folderPath,
        fileToDownloadFilePath,
        buildOutputFilePath: `${folderPath}/${processEnv.REMOTE_CORE_ENGINE_FILE_NAME}`,
        chocoFilePath: `${folderPath}/${filename}`,
        extendCssFilePath: `${folderPath}/${processEnv.REMOTE_EXTEND_CSS_FILE_NAME}`,
    };

    t.deepEqual(
        output.s3,
        expectedOutput
    );
});

test('lambdaDataObject has a valid "local" object', t => {
    const output = t.context.createLambdaDataObject();

    const localFolder = getLocalFolder(
        t.context.input.buildNumber,
        t.context.input.flavourId
    );

    const sourceFolder = getSourceFolder(localFolder);
    const buildFolder = getBuildFolder(localFolder);

    const getPathFromLocal = R.curryN(2, path.resolve)(localFolder);
    const getPathFromSource = R.curryN(2, path.resolve)(sourceFolder);
    const getPathFromBuild = R.curryN(2, path.resolve)(buildFolder);
    const getPathFromRoot = R.curryN(2, path.resolve)(processEnv.LOCAL_ROOT_FOLDER);

    const expectedOutput = {
        toBuildFolderPath: sourceFolder,
        toBuildPackageJsonFilePath: getPathFromSource('package.json'),
        toBuildDistFolderPath: getPathFromSource('dist'),
        afterBuildFolderPath: buildFolder,
        afterBuildPackageJsonFilePath: getPathFromBuild('package.json'),
        afterBuildDistFolderPath: getPathFromLocal('build/dist'),
        extractedFolderPath: getPathFromLocal(processEnv.LOCAL_PROJECT_TO_BUILD_ROOT_FOLDER),
        chocoFilePath: getPathFromSource(t.context.input.filename),
        extendCssFilePath: getPathFromSource(processEnv.REMOTE_EXTEND_CSS_FILE_NAME),
        coreEnginePackageJsonFilePath: getPathFromRoot('package.json'),
        tmpFolder: localFolder,
    };

    t.deepEqual(
        output.local,
        expectedOutput
    );
});
