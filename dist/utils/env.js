const { join } = require("node:path");

module.exports.determineInstallPath = function(options, configData) {
    const { path, config } = configData;
    const { side, environment } = options;
    const installPath = environment?.path ?? side;
    return join(path, config.baseDir, installPath);
}