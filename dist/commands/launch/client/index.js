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
const { join } = require("node:path");
const { detectOS, detectArch, spawnAsync, determineInstallPath } = require("../../../utils");
const { getProfileVersion } = require("./profile");
const { getMergedVersionJSON } = require("./version");
const { getClasspath } = require("./classpath");
const { subsitutePlaceholders } = require("./placeholder");
const { generateUUID } = require("./uuid")

function getClasspathSeperator(osName) {
    if (osName === "windows") {
        return ";";
    }
    return ":";
}

module.exports.launchClient = async function(cliVersion, options, config) {
    const { profile, environment } = options;
    const installDir = determineInstallPath(options, config);
    const versionsDir = join(installDir, "versions");
    const libDir = join(installDir, "libraries");
    const assetsDir = join(installDir, "assets");
    const { playerName } = environment;
    const authUUID = generateUUID(playerName);
    const osName = detectOS();
    const arch = detectArch();
    const classpathSeparator = getClasspathSeperator(osName);

    const version = getProfileVersion({ installDir, profileName: profile });
    const versionJSON = getMergedVersionJSON({ versionsDir, version, osName, arch });
    const classpath = getClasspath({ versionJSON, libDir, separator: classpathSeparator });
    const { mainClass, assets: assetIndex } = versionJSON;

    const subsitute = (str) => subsitutePlaceholders(str, {
        version: cliVersion, classpath, loaderVersion: version, libDir, classpathSeparator,
        assetsDir, assetIndex, playerName, authUUID, versionType: versionJSON.type, gameDir: installDir
    });
    const jvmArgs = versionJSON.arguments.jvm.map(arg => subsitute(arg));
    const gameArgs = versionJSON.arguments.game.map(arg => subsitute(arg));

    await spawnAsync("java", [
        ...jvmArgs,
        mainClass,
        ...gameArgs
    ], { cwd: installDir });
}