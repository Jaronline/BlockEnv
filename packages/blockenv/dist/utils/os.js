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
const { machine, platform } = require("node:os");

module.exports.usingWindows = function() {
    return platform() === "win32";
}

module.exports.detectOS = function() {
    switch (platform()) {
        case "linux":
            return "linux";
        case "darwin":
            return "osx";
        case "win32":
            return "windows";
        default:
            throw new Error(`Unsupported platform: ${platform()}`);
    }
}

module.exports.detectArch = function() {
    switch (machine()) {
        case "x86_64":
            return "x86_64";
        case "i386":
        case "i686":
            return "x86";
        case "arm64":
        case "aarch64":
            return "arm64";
        case "arm":
            return "arm32";
        default:
            throw new Error(`Unsupported architecture: ${machine()}`);
    }
}