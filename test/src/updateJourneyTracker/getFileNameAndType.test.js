import test from 'ava';

import getFileNameAndType from './getFileNameAndType';

test('should return an object with 2 keys: "name" and "type" ', t => {
    const fileName = 'abc.js';

    const actual = getFileNameAndType(fileName);
    const expected = {
        name: 'abc.js',
        type: 'js',
    };

    t.deepEqual(
        actual,
        expected
    );
});
