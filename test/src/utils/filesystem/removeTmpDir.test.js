import test from 'ava';
import { assert, stub } from 'sinon';

import { removeTmpDir } from './removeTmpDir';

test('it executes \'rm -rf ${directory}\'', t => {
    const execSpy = stub();

    removeTmpDir(
        execSpy,
        '/tmp/some-directory'
    );

    assert.calledOnce(execSpy);
    assert.calledWithExactly(execSpy, 'rm -rf /tmp/some-directory');
    t.pass();
});

test('it won\'t delete anything not in a /tmp folder', t => {
    const execSpy = stub();

    const err = t.throws(
        () => removeTmpDir(
            execSpy,
            'some-directory'
        )
    );

    assert.notCalled(execSpy);

    t.is(
        err.message,
        `Expected to delete a directory under '/tmp', but was given 'some-directory'.`
    );
});

test('it will only delete files under root /tmp directory', t => {
    const execSpy = stub();

    const err = t.throws(
        () => removeTmpDir(
            execSpy,
            '/foo/tmp/some-directory'
        )
    );

    assert.notCalled(execSpy);


    t.is(
        err.message,
        `Expected to delete a directory under '/tmp', but was given '/foo/tmp/some-directory'.`
    );
});
