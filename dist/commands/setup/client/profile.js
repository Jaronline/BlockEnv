const { existsSync } = require("node:fs");
const { writeFile } = require("node:fs/promises");
const { join } = require("node:path");

module.exports.generateLauncherProfiles = async function({ installDir }) {
    const profileFile = join(installDir, "launcher_profiles.json");

    if (!existsSync(profileFile)) {
        console.log("Generating launcher profiles...");
        await writeFile(profileFile, JSON.stringify({
            profiles: {},
            settings: {},
            version: 4
        }, null, 4), "utf8");
    }
}