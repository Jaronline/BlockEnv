const { Environment } = require("../structures/Environment");
const { InvalidArgumentError } = require("commander");

module.exports.parseEnvName = function({ config }, value) {
    if (!Object.keys(config.environments).includes(value)) {
        throw new InvalidArgumentError(`Environment "${value}" does not exist.`);
    }
    return new Environment(config.environments[value]);
}