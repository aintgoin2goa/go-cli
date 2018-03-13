const parseEvent = event => {
    if (!event
        || !event.Records
        || !event.Records[0]
        || !event.Records[0].awsRegion
        || !event.Records[0].s3
        || !event.Records[0].s3.bucket
        || !event.Records[0].s3.bucket.name
        || !event.Records[0].s3.object
        || !event.Records[0].s3.object.key
    ) {
        throw new Error('Error parsing event: Missing bucket, key or region');
    }

    const [record] = event.Records;
    const s3Bucket = record.s3.bucket.name;
    const s3Key = decodeURIComponent(record.s3.object.key);
    const s3Region = record.awsRegion;

    const segments = s3Key.split('/');

    const [
        projectName,
        pipelineName,
    ] = segments;

    const [
        buildNumber,
        ,
        flavourId,
        filename,
    ] = segments.slice(-4);

    const [
        country,
        target,
        chapter,
    ] = flavourId.split('_');

    const folderPath = segments.slice(0,-1).join('/');
    const pipelineFolderPath = segments.slice(0,-3).join('/');

    return {
        s3Bucket,
        s3Key,
        s3Region,
        projectName,
        pipelineName,
        buildNumber,
        flavourId,
        country,
        target,
        chapter,
        filename,
        folderPath,
        pipelineFolderPath,
    };
};

module.exports = parseEvent;
