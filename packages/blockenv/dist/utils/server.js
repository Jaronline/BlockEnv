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
const spawnAsync = require("./spawn");
const { usingWindows } = require("./os");

module.exports.runServer = async function(path) {
    console.log("Starting up server with run script...");
    const isWindows = usingWindows();
    const command = isWindows ? "cmd.exe" : "./run.sh";
    const args = isWindows ? ["/c", "run.bat"] : [];
    await spawnAsync(command, args, {
        cwd: path
    });
}