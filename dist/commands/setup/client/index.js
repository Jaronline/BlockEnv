const { getConfig } = require("../../../config");
const { detectOS, detectArch } = require("../../../utils");
const { downloadManifest } = require("./manifest");
const { downloadVersionMeta, downloadVersionJar } = require("./version");
const { downloadLibraries, extractNatives } = require("./libraries");
const { downloadAssetsIndex, downloadAssets } = require("./assets");
const { generateLauncherProfiles } = require("./profile");
const { downloadInstaller, runInstaller, cleanInstaller } = require("../installer");
const { join } = require("node:path");
const { existsSync } = require("node:fs");

module.exports.setupClient = async function(options) {
    const { loaderVersion, minecraftVersion } = options;
    const { path, config } = getConfig();
    const envDir = join(path, config.baseDir);
    const installDir = join(envDir, "client");
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