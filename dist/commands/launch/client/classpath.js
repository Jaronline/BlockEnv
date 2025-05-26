const { join, sep } = require("node:path");
const { existsFilter } = require("../../../filters");

module.exports.getClasspath = function({ versionJSON, libDir, separator }) {
    return versionJSON.libraries
        .filter(lib => !/:natives-/.test(lib.name))
        .map(lib => join(libDir, lib.downloads.artifact.path))
        .filter(existsFilter)
        .join(separator);
}