import test from 'ava';
import {
    spy,
    assert,
} from 'sinon';

import { downloader } from './download';

test('download calls three functions and returns the same object we pass', async t => {
    const event = 3;

    const logAbs = a => a + 1;
    const downloadAbs = a => Promise.resolve(a / 2);
    const logChoco = a => a - 3;
    const downloadChoco = a => Promise.resolve(a * 2);
    const logExtendCss = a => a + 2;
    const downloadExtendCss = a => Promise.resolve(a * 3);

    const downloadAbsSpy = spy(downloadAbs);
    const downloadChocoSpy = spy(downloadChoco);
    const downloadExtendCssSpy = spy(downloadExtendCss);

    const result = await downloader(
        downloadAbsSpy,
        downloadChocoSpy,
        downloadExtendCssSpy,
        {
            downloadAbsTar:logAbs,
            downloadChocoJson:logChoco,
            downloadExtendCss:logExtendCss,
        },
        event
    );
    assert.calledOnce(downloadAbsSpy);
    assert.calledWithExactly(
        downloadAbsSpy,
        (event + 1)
    );
    assert.calledOnce(downloadChocoSpy);
    assert.calledWithExactly(
        downloadChocoSpy,
        (event - 3)
    );
    assert.calledOnce(downloadExtendCssSpy);
    assert.calledWithExactly(
        downloadExtendCssSpy,
        (event + 2)
    );
    t.is(
        result,
        event
    );
});
