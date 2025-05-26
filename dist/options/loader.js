const { InvalidArgumentError } = require("commander");

const supportedLoaders = ["neoforge"];

module.exports.parseLoader = function(value) {
    if (!supportedLoaders.includes(value)) {
        throw new InvalidArgumentError(`Unsupported modloader: ${value}. Supported modloaders are: ${supportedLoaders.join(", ")}`);
    }
    return value;
}