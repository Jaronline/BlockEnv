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
const { existsSync } = require("node:fs");
const { mkdir } = require("node:fs/promises");
const { join } = require("node:path");
const { curl } = require("../../../utils");

function getVersionMetaURL({ manifestPath, minecraftVersion }) {
    const versionMetaURL = require(manifestPath)?.versions?.find?.(v => v.id === minecraftVersion)?.url;

    if (!versionMetaURL) {
        throw new Error(`Could not find metadata for version ${minecraftVersion}`);
    }

    return versionMetaURL;
}

module.exports.downloadVersionMeta = async function({ manifestPath, versionDir, minecraftVersion }) {
    const versionMetaURL = getVersionMetaURL({ manifestPath, minecraftVersion });

    if (!existsSync(versionDir)) {
        await mkdir(versionDir, { recursive: true });
    }

    const versionJSON = join(versionDir, `${minecraftVersion}.json`);

    if (!existsSync(versionJSON)) {
        console.log(`Downloading version ${minecraftVersion} metadata...`);
        await curl(versionMetaURL, {
            location: true,
            output: versionJSON,
            silent: true,
            showError: true,
            failOnError: true,
            retry: 3
        });
    }

    return require(versionJSON);
}

module.exports.downloadVersionJar = async function({ versionDir, minecraftVersion, versionJSON }) {
    const versionJar = join(versionDir, `${minecraftVersion}.jar`);

    if (!existsSync(versionJar)) {
        const mcJarURL = versionJSON.downloads?.client?.url;
        console.log(`Downloading Minecraft client jar for version ${minecraftVersion}...`);
        await curl(mcJarURL, {
            location: true,
            output: versionJar,
            silent: true,
            showError: true,
            failOnError: true,
            retry: 3
        });
    }
}