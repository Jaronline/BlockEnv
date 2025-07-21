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
const { basename, join, dirname } = require("node:path");

/**
 * @param {Downloader} downloader
 * @param assetIndexDir
 * @param versionJSON
 */
module.exports.downloadAssetsIndex = async function(downloader, { assetIndexDir, versionJSON }) {
    if (!existsSync(assetIndexDir)) {
        await mkdir(assetIndexDir, { recursive: true });
    }

    const assetsURL = versionJSON.assetIndex.url;
    const assetIndexFile = basename(assetsURL);
    const indexFile = join(assetIndexDir, assetIndexFile);

    if (!existsSync(indexFile)) {
		await downloader.download(assetsURL, {
			hooks: {
				onDownloadStart: () => console.log("Downloading assets index..."),
				onDownloadEnd: () => console.log("Assets index downloaded successfully."),
			},
			output: indexFile,
		});
    }

    return require(indexFile);
}

/**
 * @param {Downloader} downloader
 * @param indexFile
 * @param assetsDir
 */
module.exports.downloadAssets = async function(downloader, { indexFile, assetsDir }) {
	const filesToDownload = Object.entries(indexFile.objects)
		.map(([ key, value ]) => ({ hash: value.hash, path: key, subDir: value.hash.substring(0, 2) }))
		.map(({ hash, path, subDir }) =>
			({ hash, path, subDir, dest: join(assetsDir, "objects", subDir, hash) }))
		.filter(({ dest }) => !existsSync(dest));

	if (filesToDownload.length === 0) {
		return;
	}

	const urls = filesToDownload.map(({ hash, subDir }) => `https://resources.download.minecraft.net/${subDir}/${hash}`);
	const destinations = filesToDownload.map(({ dest }) => dest);
	await downloader.downloadBatches(urls, {
		hooks: {
			onBatchListStart: ({ batchSize }) => console.log(`Downloading assets in batches of ${batchSize}...`),
			onBatchDownloadStart: ({ batchIndex: i, batchSize, urls, batchCount }) =>
				console.log(`Downloading batch ${Math.floor(i / batchSize) + 1} of ${batchCount} (${urls.length} files)...`),
			onDownloadStart: ({ index, batchIndex }) => console.log(`Downloading asset ${filesToDownload[index + batchIndex].path}...`),
			onDownloadEnd: ({ index, batchIndex }) => console.log(`Asset ${filesToDownload[index + batchIndex].path} downloaded successfully.`),
			onDownloadError: ({ error, index, batchIndex }) =>
				Promise.reject(new Error(`Error downloading asset ${filesToDownload[index + batchIndex].path}: ${error.message}`)),
			onBatchDownloadEnd: () => console.log("All assets in batch downloaded successfully."),
			onBatchListEnd: () => console.log("All assets downloaded successfully."),
		},
		output: destinations,
	});
}
