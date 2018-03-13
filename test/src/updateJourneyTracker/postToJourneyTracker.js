const R = require('ramda');
const request = require('request');

const journeyTrackerPoster = (
    request,
    apiEndpoint,
    {
        s3Bucket,
        s3Directory,
        journeyTrackerData,
    }
) => {
    const body = JSON.stringify({
        data: journeyTrackerData,
        s3Bucket,
        s3Directory,
    });

    return request({
        method: 'POST',
        url: apiEndpoint,
        body,
    });
};

const postToJourneyTracker = R.curry(journeyTrackerPoster)(request);

module.exports = {
    journeyTrackerPoster,
    postToJourneyTracker,
};
