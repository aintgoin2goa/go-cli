import test from 'ava';
import { stub, assert } from 'sinon';

import build from './build';

test.beforeEach(t => {
    t.context.data = {
        build: {
            chapter: '<chapter>',
            country: '<country>',
        },
        local: {
            toBuildFolderPath: '<build-source>',
            extendCssFilePath: '<extend-css-path>',
            chocoFilePath: '<choco-path>',
        },
    };
});

test('it executes `npm build` with chapter and country, passing required options', t => {
    const { data } = t.context;

    const execSync = stub().returns('<command-output>');

    build(data, execSync);

    const expectedCmd = [
        'npm run build --',
        '--chapter=<chapter>',
        '--country=<country>',
        '--moduleAliasesPath=<choco-path>',
        '--extendCssPath=<extend-css-path>',
    ].join(' ');

    assert.calledOnce(execSync);
    assert.calledWithExactly(
        execSync,
        expectedCmd,
        {
            cwd: '<build-source>',
            stdio: 'inherit',
        }
    );

    t.pass();
});

test('it returns data', t => {
    const { data } = t.context;

    const result = build(
        data,
        stub()
    );

    t.is(result, data);
});
