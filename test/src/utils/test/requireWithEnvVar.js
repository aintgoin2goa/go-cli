const requireWithEnvVar = (
    requireModule,
    moduleName
) => {
    process.env = Object.assign(
        {},
        process.env,
        require('../../../processEnv.js')
    );
    return requireModule(moduleName);
};

module.exports = requireWithEnvVar;
