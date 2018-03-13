import path from 'path';

import test from 'ava';

import readDirectory from './readDirectory';

test('should return an object with 2 keys', async t => {
    const rootDirectory = path.resolve(
        'test/',
        'distTest'
    );
    const filePathsList = await readDirectory(rootDirectory);
    t.true(Object.keys(filePathsList).length === 2);
});
