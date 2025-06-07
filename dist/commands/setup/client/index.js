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
const { detectOS, detectArch } = require("../../../utils");
const { downloadManifest } = require("./manifest");
const { downloadVersionMeta, downloadVersionJar } = require("./version");
const { downloadLibraries, extractNatives } = require("./libraries");
const { downloadAssetsIndex, downloadAssets } = require("./assets");
const { generateLauncherProfiles } = require("./profile");
const { downloadInstaller, runInstaller, cleanInstaller } = require("../installer");
const { determineInstallPath } = require("../../../utils");
const { join } = require("node:path");
const { existsSync } = require("node:fs");

module.exports.setup = async function(options, config) {
    const { loaderVersion, minecraftVersion } = options;
    const installDir = determineInstallPath(options, config);
    const versionsDir = join(installDir, "versions");
    const versionDir = join(versionsDir, minecraftVersion);
    const libDir = join(installDir, "libraries");
    const assetsDir = join(installDir, "assets");
    const assetIndexDir = join(assetsDir, "indexes");
    const nativesDir = join(installDir, "natives");
    const osName = detectOS();
    const arch = detectArch();

    const manifestPath = await downloadManifest({ versionsDir });
    const versionJSON = await downloadVersionMeta({ manifestPath, versionDir, minecraftVersion });
    await downloadVersionJar({ versionJSON, versionDir, minecraftVersion });
    await downloadLibraries({ libDir, versionJSON, osName, arch });
    await extractNatives({ nativesDir, libDir, osName, arch, versionJSON });
    const indexFile = await downloadAssetsIndex({ assetIndexDir, versionJSON });
    await downloadAssets({ indexFile, assetsDir });
    await generateLauncherProfiles({ installDir });

    if (!existsSync(join(versionsDir, `neoforge-${loaderVersion}`, `neoforge-${loaderVersion}.json`))) {
        const tmpDir = await downloadInstaller({ loaderVersion });
        await runInstaller({ installDir, tmpDir }, {
            installClient: installDir
        });
        await cleanInstaller(tmpDir);
    }
}