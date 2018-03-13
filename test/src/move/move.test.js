import test from 'ava';
import {
    stub,
    assert,
} from 'sinon';

import {
    localAfterBuildFolderPathAccessor,
    localToBuildDistFolderPathAccessor,
    localToBuildPackageJsonFilePathAccessor,
    localAfterBuildDistFolderPathAccessor,
    localAfterBuildPackageJsonFilePathAccessor,
} from '../utils/model/lambdaDataAccessors';
import { move } from './move';

test.beforeEach(t => {
    t.context.mkdirSync = stub();
    t.context.moveFile = stub();
    t.context.data = {
        local: {
            afterBuildFolderPath: 'afterBuildFolder',
            toBuildPackageJsonFilePath: 'toBuildPackageJsonFile',
            toBuildDistFolderPath: 'toBuildDistFolder',
            afterBuildPackageJsonFilePath: 'afterBuildPackageJsonFile',
            afterBuildDistFolderPath: 'afterBuildDistFolder',
        },
    };

    t.context.move = move.bind(
        null,
        t.context.mkdirSync,
        t.context.moveFile,
        localAfterBuildFolderPathAccessor,
        localToBuildDistFolderPathAccessor,
        localToBuildPackageJsonFilePathAccessor,
        localAfterBuildDistFolderPathAccessor,
        localAfterBuildPackageJsonFilePathAccessor,
    );
});

test('it calls mkDir with afterBuildFolderPath', async t => {
    await t.context.move(t.context.data);

    assert.calledOnce(t.context.mkdirSync);
    assert.calledWithExactly(
        t.context.mkdirSync,
        'afterBuildFolder'
    );
    t.pass();
});

test('it calls move with localPackageJsonPath and afterBuildPackageJsonPath', async t => {
    await t.context.move(t.context.data);

    assert.calledTwice(t.context.moveFile);
    assert.calledWithExactly(
        t.context.moveFile,
        'toBuildPackageJsonFile',
        'afterBuildPackageJsonFile'
    );
    t.pass();
});

test('it calls move with localDistFolderPath and afterBuildDistFolderPath', async t => {
    await t.context.move(t.context.data);

    assert.calledTwice(t.context.moveFile);
    assert.calledWithExactly(
        t.context.moveFile,
        'toBuildDistFolder',
        'afterBuildDistFolder'
    );
    t.pass();
});
