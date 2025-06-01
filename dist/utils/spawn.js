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
const { spawn } = require("node:child_process");

module.exports = function(command, args, options = {}) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, { stdio: "inherit", ...options });

        child.on("error", (error) => {
            reject(error);
        });

        child.on("exit", (code) => {
            if (code !== 0) {
                reject(new Error(`Command "${command}" failed with exit code ${code}`));
            } else {
                resolve();
            }
        });
    });
}