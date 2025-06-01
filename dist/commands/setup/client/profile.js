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