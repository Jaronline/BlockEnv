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
const { parseSide, parseLoader } = require("../../options");

/**
 * @param {import("../../lib").Program} program
 */
module.exports.loadCommands = function(program) {
    program
        .command("setup")
        .description("Setup the testing environment")
        .option("-s, --side <side>", "Whether to setup the server or client", parseSide)
        .option("-m, --minecraft-version <version>", "Specify the Minecraft version to use")
        .requiredOption("-l, --loader <loader>", "Specify the modloader to use (currently only 'neoforge' is supported)", "neoforge", parseLoader)
        .requiredOption("--loader-version <version>", "Specify the modloader version to use")
        .action(async (options) => {
            try {
                await runSetup(options, program.config());
            } catch (error) {
                program.error(error.message);
            }
        });
}

async function runSetup(options, config) {
    const { side } = options;
    if (!side || side == "client") {
        await require("./client").setupClient(options, config);
    }
    if (!side || side == "server") {
        await require("./server").setupServer(options, config);
    }
}