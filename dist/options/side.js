const { InvalidArgumentError } = require("commander");

module.exports.parseSide = function(value) {
    if (value !== "client" && value !== "server") {
        throw new InvalidArgumentError("Value should be either 'client' or 'server'");
    }
    return value;
}