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