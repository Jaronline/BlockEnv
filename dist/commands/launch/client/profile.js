const { join } = require("node:path")

module.exports.getProfileVersion = function({ installDir, profileName }) {
    const profilesJSON = require(join(installDir, "launcher_profiles.json"));
    const profile = profilesJSON.profiles[profileName];

    if (!profile) {
        throw new Error(`Profile "${profileName}" not found in launcher_profiles.json`);
    }

    return profile.lastVersionId;
}