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
const { Option } = require("commander");
const { parseSide, parseEnvName } = require("../../options");

/**
 * @param {import("../../lib").Program} program
 */
module.exports.loadCommands = function(program) {
    program
        .command("launch")
        .description("Launch the Minecraft client or server")
        .addOption(new Option("-s, --side <side>", "Whether to launch the server or client (default: client)").argParser(parseSide))
        .addOption(new Option("-e, --environment <environment>", "The environment to use for the launch").conflicts("side").argParser(parseEnvName.bind(null, program.config())))
        .option("-p, --profile <profile>", "The client profile to launch")
        .action(async (options) => {
            try {
                await runLaunch(program.version(), options, program.config());
            } catch (error) {
                program.error(error.message);
            }
        });
}

async function runLaunch(version, options, config) {
    const { side = "client", environment } = options;
    switch (environment?.type ?? side) {
        case "client":
            await require("./client").launchClient(version, options, config);
            break;
        case "server":
            await require("./server").launchServer(options, config);
            break;
    }
}