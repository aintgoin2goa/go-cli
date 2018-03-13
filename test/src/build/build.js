const { execSync } = require('child_process');

const build = (
    data,
    exec = execSync
) => {
    const {
        country,
        chapter,
    } = data.build;

    const {
        toBuildFolderPath,
        extendCssFilePath,
        chocoFilePath,
    } = data.local;

    const buildArgs = [
        `--chapter=${chapter}`,
        `--country=${country}`,
        `--moduleAliasesPath=${chocoFilePath}`,
        `--extendCssPath=${extendCssFilePath}`,
    ].join(' ');

    exec(
        `npm run build -- ${buildArgs}`,
        {
            cwd: toBuildFolderPath,
            stdio: 'inherit',
        }
    );

    return data;
};

module.exports = build;
