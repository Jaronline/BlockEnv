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
const { basename, join } = require("node:path");
const { curl } = require("../../../utils");

module.exports.downloadAssetsIndex = async function({ assetIndexDir, versionJSON }) {
    if (!existsSync(assetIndexDir)) {
        await mkdir(assetIndexDir, { recursive: true });
    }

    console.log("Downloading version assets...");
    const assetsURL = versionJSON.assetIndex.url;
    const assetIndexFile = basename(assetsURL);
    const indexFile = join(assetIndexDir, assetIndexFile);

    if (!existsSync(indexFile)) {
        await curl(assetsURL, {
            silent: true,
            showError: true,
            location: true,
            output: indexFile,
            failOnError: true,
            retry: 3
        });
    }

    return require(indexFile);
}

module.exports.downloadAssets = async function({ indexFile, assetsDir }) {
    await Promise.all(Object.entries(indexFile.objects)
        .map(([ key, value ]) => ({ hash: value.hash, path: key }))
        .map(async ({ hash, path }) => {
            const subDir = hash.substring(0, 2);
            const url = `https://resources.download.minecraft.net/${subDir}/${hash}`;
            const destDir = join(assetsDir, "objects", subDir);
            const dest = join(destDir, hash);

            if (!existsSync(dest)) {
                console.log(`Downloading asset ${path}...`);
                await mkdir(destDir, { recursive: true });
                await curl(url, {
                    ip: "ipv4",
                    silent: true,
                    showError: true,
                    location: true,
                    output: dest,
                    failOnError: true,
                    retry: 3
                });
            }
        }));
}