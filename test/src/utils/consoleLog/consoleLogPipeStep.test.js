import test from 'ava';
import {
    stub,
    assert,
} from 'sinon';
import proxyquire from 'proxyquire';

const log = stub();

const logStep = proxyquire('./consoleLogPipeStep', {
    'fancy-log': log,
});

test.beforeEach(t => {
    log.reset();
    t.context.input = { some:  'input' };
});

test('parser', t => {
    const output = logStep.parser(t.context.input);
    t.is(
        output,
        t.context.input
    );
    assert.calledOnce(log);
    assert.calledWithExactly(
        log,
        'parser'
    );
});

test('storeLambdaObject', t => {
    const output = logStep.storeLambdaObject(t.context.input);
    t.is(
        output,
        t.context.input
    );
    assert.calledOnce(log);
    assert.calledWithExactly(
        log,
        'store lambda object'
    );
});

test('beginLog', t => {
    const output = logStep.beginLog(t.context.input);
    t.is(
        output,
        t.context.input
    );
    assert.calledOnce(log);
    assert.calledWithExactly(
        log,
        'begin log'
    );
});

test('download', t => {
    const output = logStep.download(t.context.input);
    t.is(
        output,
        t.context.input
    );
    assert.calledOnce(log);
    assert.calledWithExactly(
        log,
        'download'
    );
});

test('build', t => {
    const output = logStep.build(t.context.input);
    t.is(
        output,
        t.context.input
    );
    assert.calledOnce(log);
    assert.calledWithExactly(
        log,
        'build'
    );
});

test('move', t => {
    const output = logStep.move(t.context.input);
    t.is(
        output,
        t.context.input
    );
    assert.calledOnce(log);
    assert.calledWithExactly(
        log,
        'move'
    );
});

test('upload', t => {
    const output = logStep.upload(t.context.input);
    t.is(
        output,
        t.context.input
    );
    assert.calledOnce(log);
    assert.calledWithExactly(
        log,
        'upload'
    );
});

test('updateJourneyTracker', t => {
    const output = logStep.updateJourneyTracker(t.context.input);
    t.is(
        output,
        t.context.input
    );
    assert.calledOnce(log);
    assert.calledWithExactly(
        log,
        'update journey tracker'
    );
});

test('endLog', t => {
    const output = logStep.endLog(t.context.input);
    t.is(
        output,
        t.context.input
    );
    assert.calledOnce(log);
    assert.calledWithExactly(
        log,
        'end log'
    );
});

test('success', t => {
    const output = logStep.success(t.context.input);
    t.is(
        output,
        t.context.input
    );
    assert.calledOnce(log);
    assert.calledWithExactly(
        log,
        'success callback'
    );
});

test('downloadAbsTar', t => {
    const output = logStep.downloadAbsTar(t.context.input);
    t.is(
        output,
        t.context.input
    );
    assert.calledOnce(log);
    assert.calledWithExactly(
        log,
        'download abs tar'
    );
});

test('downloadChocoJson', t => {
    const output = logStep.downloadChocoJson(t.context.input);
    t.is(
        output,
        t.context.input
    );
    assert.calledOnce(log);
    assert.calledWithExactly(
        log,
        'download choco json'
    );
});

test('downloadExtendCss', t => {
    const output = logStep.downloadExtendCss(t.context.input);
    t.is(
        output,
        t.context.input
    );
    assert.calledOnce(log);
    assert.calledWithExactly(
        log,
        'download extendCss json'
    );
});

test('uploadTar', t => {
    const output = logStep.uploadTar(t.context.input);
    t.is(
        output,
        t.context.input
    );
    assert.calledOnce(log);
    assert.calledWithExactly(
        log,
        'upload tar'
    );
});
