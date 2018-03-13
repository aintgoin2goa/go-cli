import test from 'ava';

import { parser } from './parse';

test('parse calls two functions and returns an object', t => {
    const event = 1;
    const processEnv = 2;

    const result = parser(
        (a, b) => a + b,
        (a, b) => a - b,
        processEnv,
        event,
    );

    t.is(
        result,
        processEnv - (event + processEnv)
    );
});
