import test from 'ava';
import {
    spy,
    assert,
} from 'sinon';

import requireWithEnvVar from './requireWithEnvVar';

test('call the first parameters with second passed as argument', t => {
    const functionSpy = spy();
    const input = 1;

    requireWithEnvVar(
        functionSpy,
        input
    );

    assert.calledOnce(functionSpy);
    assert.calledWithExactly(
        functionSpy,
        input
    );
    t.pass();
});



