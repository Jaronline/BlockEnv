const { rm } = require("node:fs/promises");

module.exports = async function(path, options = {}) {
    return rm(path, { ...options, recursive: true, force: true });
}