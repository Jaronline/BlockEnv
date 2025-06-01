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
const { dirname, join, parse } = require("node:path");
const { existsSync } = require("node:fs");

function hasConfigInPath(path) {
    return existsSync(join(path, "blockenv.config.json"));
}

function getConfigInPath(path) {
    if (!hasConfigInPath(path)) {
        return null;
    }
    return join(path, "blockenv.config.json");
}

function nearestConfig({ from = process.cwd() } = {}) {
    const { root } = parse(from);
    let currentPath = from;
    while (!hasConfigInPath(currentPath) && currentPath !== root) {
        currentPath = dirname(currentPath);
    }
    return getConfigInPath(currentPath);
}

module.exports.getConfig = function() {
    const configFile = nearestConfig();
    if (!configFile) {
        throw new Error("No configuration file found. Please ensure you have a blockenv configuration in your project directory or any parent directory.");
    }
    const parsedFile = parse(configFile);
    return {
        path: parsedFile.dir,
        file: parsedFile.base,
        ext: parsedFile.ext,
        name: parsedFile.name,
        config: require(configFile),
    };
}