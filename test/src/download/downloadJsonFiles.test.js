import test from 'ava';
import R from 'ramda';

import { jsonDownloader } from './downloadJsonFiles';

test('pipes correctly the passed functions', async t => {
    const identityLens = R.lens(
        R.identity,
        R.identity
    );

    const event = 2;

    const output = await jsonDownloader(
        identityLens,
        R.add(8),
        R.divide,
        event
    );

    const expectedOutput = (event + 8) / event;

    t.is(
        output,
        expectedOutput
    );
});
