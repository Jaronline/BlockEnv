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

/**
 * @param {Downloader} downloader
 * @param versionsDir
 */
module.exports.downloadManifest = async function(downloader, { versionsDir }) {
    if (!existsSync(versionsDir)) {
        await mkdir(versionsDir, { recursive: true });
    }

    const versionManifestPath = join(versionsDir, "version_manifest_v2.json");

    if (!existsSync(versionManifestPath)) {
		await downloader.download("https://piston-meta.mojang.com/mc/game/version_manifest_v2.json", {
			hooks: {
				onDownloadStart: () => console.log("Starting download of version manifest..."),
				onDownloadEnd: () => console.log("Version manifest downloaded successfully."),
			},
			output: versionManifestPath,
		});
    }

    return versionManifestPath;
}
