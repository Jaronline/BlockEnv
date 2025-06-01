module.exports.parseEnvName = function({ config }, value) {
    if (!Object.keys(config.environments).includes(value)) {
        throw new Error(`Environment "${value}" does not exist.`);
    }
    return value;
}