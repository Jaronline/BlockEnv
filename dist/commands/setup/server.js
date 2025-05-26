const { getConfig } = require("../../config");
const { runServer } = require("../../utils");
const { downloadInstaller, runInstaller, cleanInstaller } = require("./installer");
const { existsSync } = require("node:fs");
const { join } = require("node:path");

module.exports.setupServer = async function(options) {
    const { loaderVersion } = options;
    const { path, config } = getConfig();
    const envDir = join(path, config.baseDir);
    const installDir = join(envDir, "server");

    if (!existsSync(join(installDir, "run.bat")) || !existsSync(join(installDir, "run.sh"))) {
        const tmpDir = await downloadInstaller({ loaderVersion });
        await runInstaller(
            { installDir, tmpDir },
            { installServer: installDir, serverJar: true });
        await cleanInstaller(tmpDir);
    }

    if (!existsSync(join(installDir, "eula.txt"))) {
        await runServer(installDir);
    }
}