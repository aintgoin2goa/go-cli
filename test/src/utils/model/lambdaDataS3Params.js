const R = require('ramda');

const {
    s3FileToDownloadFilePathAccessor,
    s3BucketAccessor,
    s3ChocoFilePathAccessor,
    s3ExtendCssFilePathAccessor,
    s3BuildOutputFilePathAccessor,
} = require('./lambdaDataAccessors');

const s3ParamsGetterWithAccessorsToCurry = (
    keyAccessor,
    bucketAccessor,
    lambdaDataObject
) => {
    const key = R.view(
        keyAccessor,
        lambdaDataObject
    );
    const bucket = R.view(
        bucketAccessor,
        lambdaDataObject
    );

    const s3Params = {
        Key: key,
        Bucket: bucket,
    };

    return s3Params;
};

const s3ParamsGetterWithAccessors = R.curry(s3ParamsGetterWithAccessorsToCurry);


const getS3GetObjectParamsForABSOutputFile = R.curry(s3ParamsGetterWithAccessors)(
    s3FileToDownloadFilePathAccessor,
    s3BucketAccessor
);

const getS3GetObjectParamsForChocoJsonFile = R.curry(s3ParamsGetterWithAccessors)(
    s3ChocoFilePathAccessor,
    s3BucketAccessor
);

const getS3GetObjectParamsForExtendCssJsonFile = R.curry(s3ParamsGetterWithAccessors)(
    s3ExtendCssFilePathAccessor,
    s3BucketAccessor
);

const getS3PutObjectParamsForBuildOutputFile = R.curry(s3ParamsGetterWithAccessors)(
    s3BuildOutputFilePathAccessor,
    s3BucketAccessor
);

module.exports = {
    getS3GetObjectParamsForABSOutputFile,
    getS3GetObjectParamsForChocoJsonFile,
    getS3GetObjectParamsForExtendCssJsonFile,
    getS3PutObjectParamsForBuildOutputFile,
};
