const { existsSync } = require("node:fs");
const { mkdir } = require("node:fs/promises");
const { join } = require("node:path");
const { curl } = require("../../../utils");

module.exports.downloadManifest = async function({ versionsDir }) {
    if (!existsSync(versionsDir)) {
        await mkdir(versionsDir, { recursive: true });
    }

    const versionManifestPath = join(versionsDir, "version_manifest_v2.json");
    
    if (!existsSync(versionManifestPath)) {
        console.log("Downloading version manifest...");
        await curl("https://piston-meta.mojang.com/mc/game/version_manifest_v2.json", {
            location: true,
            output: versionManifestPath,
            silent: true,
            showError: true,
            failOnError: true,
            retry: 3
        });
    }

    return versionManifestPath;
}