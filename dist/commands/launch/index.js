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
const { Command } = require("commander");
const { parseSide } = require("../../options/side");

/**
 * @param {Command} program
 */
module.exports.loadCommands = function(program) {
    program
        .command("launch")
        .description("Launch the Minecraft client or server")
        .option("-s, --side <side>", "Whether to launch the server or client (default: client)", parseSide)
        .option("-p, --profile <profile>", "The client profile to launch")
        .action(async (options) => {
            try {
                await runLaunch(program.version(), options);
            } catch (error) {
                program.error(error.message);
            }
        });
}

async function runLaunch(version, options) {
    const { side = "client" } = options;
    switch (side) {
        case "client":
            await require("./client").launchClient(version, options);
            break;
        case "server":
            await require("./server").launchServer(options);
            break;
    }
}