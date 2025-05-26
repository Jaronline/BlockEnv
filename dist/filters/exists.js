const { existsSync } = require("node:fs");

module.exports = function(path) {
    if (typeof path !== "string") {
        throw new TypeError("Path must be a string");
    }
    return existsSync(path);
}