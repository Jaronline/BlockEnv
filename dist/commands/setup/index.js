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
const { parseSide, parseLoader, parseEnvName } = require("../../options");
const { Option } = require("commander");

/**
 * @param {import("../../lib").Program} program
 */
module.exports.loadCommands = function(program) {
    program
        .command("setup")
        .description("Setup the testing environment")
        .option("-s, --side <side>", "Whether to setup the server or client", parseSide)
        .addOption(new Option("-e, --environment <environment>", "Which environment to setup").conflicts("side").argParser(parseEnvName.bind(null, program.config())))
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

const envTypeFiles = {
    "client": "./client",
    "server": "./server",
};

async function runSetup(options, config) {
    const { side, environment } = options;
    if (environment) {
        return require(envTypeFiles[environment.type]).setup(options, config);
    }
    if (!side || side == "client") {
        await require("./client").setup(options, config);
    }
    if (!side || side == "server") {
        await require("./server").setup(options, config);
    }
}