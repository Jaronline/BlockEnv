const { join } = require("node:path");
const { getConfig } = require("../../config");
const { runServer } = require("../../utils");

module.exports.launchServer = async function(options) {
    const { path, config } = getConfig();
    const envDir = join(path, config.baseDir);
    const installDir = join(envDir, "server");
    await runServer(installDir);
}