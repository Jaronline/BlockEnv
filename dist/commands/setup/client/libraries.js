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
const { existsSync, createWriteStream } = require("node:fs");
const { mkdir } = require("node:fs/promises");
const { join, dirname, basename } = require("node:path");
const { ruleFilter } = require("../../../filters");
const { Open: unzip } = require("unzipper");

/**
 * @param {Downloader} downloader
 * @param libDir
 * @param versionJSON
 * @param osName
 * @param arch
 * @returns {Promise<*>}
 */
module.exports.downloadLibraries = async function(downloader, { libDir, versionJSON, osName, arch }) {
    if (!existsSync(libDir)) {
        await mkdir(libDir, { recursive: true });
    }

	const librariesToDownload = versionJSON.libraries
		.filter(lib => ruleFilter(lib.rules, { osName, arch }))
		.map(lib => lib.downloads.artifact)
		.map(({ path, url }) => ({ path, url, dest: join(libDir, path) }))
		.filter(({ dest }) => !existsSync(dest));

	if (librariesToDownload.length === 0) {
		return;
	}

	const urls = librariesToDownload.map(lib => lib.url);
	const destinations = librariesToDownload.map(lib => join(libDir, lib.path));
	return downloader.downloadBatch(urls, {
		hooks: {
			onBatchDownloadStart: () => console.log(`Downloading ${urls.length} libraries...`),
			onBatchDownloadEnd: () => console.log("All libraries downloaded successfully."),
			onDownloadStart: ({index}) => console.log(`Downloading library ${librariesToDownload[index].path}...`),
			onDownloadEnd: ({index}) => console.log(`Library ${librariesToDownload[index].path} downloaded successfully.`),
			onDownloadError: ({error, index}) =>
				Promise.reject(new Error(`Failed to download library ${librariesToDownload[index].path}: ${error.message}`)),
		},
		output: destinations,
	});
}

async function extractNativesFromJar(jarPath, nativesDir) {
    console.log(`Extracting native library ${jarPath}...`);
    const directory = await unzip.file(jarPath);
    await Promise.all(directory.files
        .filter(entry => /\.(so|dll|dylib)$/i.test(entry.path))
        .map(entry => ({ entry, targetPath: join(nativesDir, basename(entry.path)) }))
        .filter(({ targetPath }) => !existsSync(targetPath))
        .map(({ entry, targetPath }) => new Promise((resolve, reject) => {
            entry.stream()
                .pipe(createWriteStream(targetPath))
                .on("finish", resolve)
                .on("error", reject);
        }))
    );
}

module.exports.extractNatives = async function({ nativesDir, libDir, osName, arch, versionJSON }) {
    if (!existsSync(nativesDir)) {
        await mkdir(nativesDir, { recursive: true });
    }

    console.log("Extracting native libraries...");
    const nativesName = `:natives-${osName}`;
    const filter = arch === "x86_64" ? nativesName : `${nativesName}-${arch}`;
    await Promise.all(versionJSON.libraries
        .filter(lib => new RegExp(`${filter}$`).test(lib.name))
        .map(lib => lib.downloads.artifact)
        .map(async ({ path }) => {
            const jar = join(libDir, path);

            if (existsSync(jar)) {
                extractNativesFromJar(jar, nativesDir);
            } else {
                return Promise.reject(new Error(`Native library ${jar} not found`));
            }
        })
    );
}
