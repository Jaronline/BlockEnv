/**!
BlockEnv: Minecraft Java testing environment for modpacks.
Copyright (C) 2025 Jaronline

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
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