import path from 'path';

import test from 'ava';

import {
    addPipelineVersionToJourneyTracker,
    addDistFileNamesToJsonBody,
} from './addDataToJourneyTracker';
import {
    VERSIONS_KEY,
    FILES_KEY,
    BUILDER_KEY,
} from '../utils/constants/constants';

test.beforeEach(t => {
    t.context.journeyTrackerBody = {
        'target': 'web',
        'version': '0.0.4',
        'country': 'au',
        'chapter': 'catalog',
        'custom-modules': [{}],
        'pipeline-station-versions': [{ 'CHoCO': '0.0.0' }],
        'pipeline-station-files': {},
    };
    t.context.pipelineStationVersions = [
        { 'CHoCO': '0.0.0' },
        { 'core-engine-builder': '2.1.2' },
    ];
    t.context.fileNames = ['xyz.js','abc.html'];
    t.context.files = [{
        name: 'xyz.js',
        type: 'js',
    },{
        name: 'abc.html',
        type: 'html',
    }];
});

test('should add Pipeline Version to Journey Tracker file', t => {
    const {
        journeyTrackerBody,
        pipelineStationVersions,
    } = t.context;

    const packageJsonPath = path.resolve(
        'test',
        'package_test.json'
    );

    const actual = addPipelineVersionToJourneyTracker(
        packageJsonPath,
        journeyTrackerBody
    );
    journeyTrackerBody[VERSIONS_KEY] = pipelineStationVersions;
    const expected = journeyTrackerBody;

    t.deepEqual(
        actual,
        expected
    );
});


test('should add all Dist Folder File Info to Journey Tracker', t => {
    const {
        journeyTrackerBody,
        files,
        fileNames,
    } = t.context;

    const actual = addDistFileNamesToJsonBody({
        journeyTrackerBody,
        fileNames,
    });

    journeyTrackerBody[FILES_KEY][BUILDER_KEY] = files;
    const expected = journeyTrackerBody;

    t.deepEqual(
        actual,
        expected
    );
});
