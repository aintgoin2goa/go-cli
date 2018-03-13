import R from 'ramda';
import test from 'ava';

import { journeyTrackerUpdater } from './updateJourneyTracker';

test('should pipe the function correctly and return the same data we pass', async t => {
    const data = '../../test/package_test.json';
    const identityLens = R.lens(
        R.identity,
        R.identity
    );
    const binary = R.binary(R.identity);

    const journeyTrackerApiEndpoint = 'some journey tracker endpoint';

    const output = await journeyTrackerUpdater(
        identityLens,
        identityLens,
        identityLens,
        identityLens,
        binary,
        binary,
        binary,
        binary,
        journeyTrackerApiEndpoint,
        data
    );

    t.is(
        output,
        data
    );
});
