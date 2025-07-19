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
const { join, basename, dirname } = require("node:path");

function getVersionMetaURL({ manifestPath, minecraftVersion }) {
    const versionMetaURL = require(manifestPath)?.versions?.find?.(v => v.id === minecraftVersion)?.url;

    if (!versionMetaURL) {
        throw new Error(`Could not find metadata for version ${minecraftVersion}`);
    }

    return versionMetaURL;
}

/**
 *
 * @param {Downloader} downloader
 * @param manifestPath
 * @param versionDir
 * @param minecraftVersion
 */
async function downloadVersionMeta(downloader, { manifestPath, versionDir, minecraftVersion }) {
    const versionMetaURL = getVersionMetaURL({ manifestPath, minecraftVersion });

    if (!existsSync(versionDir)) {
        await mkdir(versionDir, { recursive: true });
    }

    const versionJSON = join(versionDir, `${minecraftVersion}.json`);

    if (!existsSync(versionJSON)) {
		await downloader.download(versionMetaURL, {
			hooks: {
				onDownloadStart: () => console.log(`Download version ${minecraftVersion}.json metadata...`),
				onDownloadEnd: () => console.log("Version metadata downloaded successfully."),
			},
			output: versionJSON,
		});
    }

    return require(versionJSON);
}

/**
 * @param {Downloader} downloader
 * @param versionDir
 * @param minecraftVersion
 * @param versionJSON
 * @returns {Promise<void>}
 */
async function downloadVersionJar(downloader, { versionDir, minecraftVersion, versionJSON }) {
    const versionJar = join(versionDir, `${minecraftVersion}.jar`);

    if (!existsSync(versionJar)) {
        const mcJarURL = versionJSON.downloads?.client?.url;
		await downloader.download(mcJarURL, {
			hooks: {
				onDownloadStart: () => console.log(`Downloading Minecraft client jar for version ${minecraftVersion}...`),
				onDownloadEnd: () => console.log("Minecraft client jar downloaded successfully."),
			},
			output: versionJar,
		});
    }
}

function mergeVersionMetas(versionMetaA, versionMetaB) {
	return {
		...versionMetaA,
		...versionMetaB,
		arguments: {
			game: [
				...(versionMetaA.arguments?.game || []),
				...(versionMetaB.arguments?.game || [])
			],
			jvm: [
				...(versionMetaA.arguments?.jvm || []),
				...(versionMetaB.arguments?.jvm || [])
			]
		},
		libraries: [
			...(versionMetaA.libraries || []),
			...(versionMetaB.libraries || [])
		],
	};
}

async function mergeInheritedVersionMeta(downloader, { versionPath, manifestPath }) {
	if (!existsSync(versionPath)) {
		throw new Error(`Version meta ${basename(versionPath)} does not exist.`);
	}

	const versionMeta = require(versionPath);

	if ("inheritsFrom" in versionMeta) {
		const inheritedVersionPath = join(dirname(dirname(versionPath)), versionMeta.inheritsFrom,
			`${versionMeta.inheritsFrom}.json`);
		const inheritedVersionMeta = await downloadVersionMeta(downloader, {
			manifestPath,
			minecraftVersion: versionMeta.inheritsFrom,
			versionDir: dirname(inheritedVersionPath),
		});
		await downloadVersionJar(downloader, {
			versionDir: dirname(inheritedVersionPath),
			minecraftVersion: versionMeta.inheritsFrom,
			versionJSON: inheritedVersionMeta,
		});
		return mergeVersionMetas(versionMeta, await mergeInheritedVersionMeta(downloader,
				{ versionPath: inheritedVersionPath, manifestPath }));
	}

	return versionMeta;
}

module.exports = {
	mergeInheritedVersionMeta,
	downloadVersionMeta,
	downloadVersionJar,
};
