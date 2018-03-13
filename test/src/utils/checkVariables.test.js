import test from 'ava';

import { checkVariables } from './checkVariables';

test('returns true if variables are declared on object', t => {
    const testObj = { foo: 1 };
    const expectedVariables = ['foo'];

    const result = checkVariables(
        testObj,
        expectedVariables
    );

    t.is(
        result,
        true
    );
});

test('throws if variable isn\'t declared on object', t => {
    const testObj = { bar: 2 };
    const expectedVariables = ['foo', 'bar'];

    const error = t.throws(
        () => checkVariables(
            testObj,
            expectedVariables
        ),
        Error
    );

    t.is(
        error.message,
        'The required variable `foo` is undefined.'
    );
});
